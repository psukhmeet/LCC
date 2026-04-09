import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthContext } from '../context/AuthContext';
import useWebRTC from '../hooks/useWebRTC';
import VideoPlayer from '../components/live/VideoPlayer';
import ChatPanel from '../components/live/ChatPanel';
import Controls from '../components/live/Controls';
import RaisedHandQueue, { useRaisedHands } from '../components/live/RaisedHandQueue';

const LiveClass = () => {
  const { classId } = useParams();
  const navigate    = useNavigate();
  const { currentUser, userProfile, isTeacher } = useAuthContext();
  const joinTimeRef = useRef(null);

  // ── Merge Firebase user + Firestore profile for hooks ──
  const userObj = currentUser ? {
    uid:  currentUser.uid,
    name: userProfile?.name || currentUser.displayName || 'User',
    role: userProfile?.role || 'student',
  } : null;

  // ── WebRTC ──
  const {
    localStream, remoteStream,
    isAudioMuted, isVideoOn, isScreenSharing,
    connectionStatus,
    toggleAudio, toggleVideo, toggleScreenShare,
    endClass, stopLocalStream,
  } = useWebRTC(classId, userObj, isTeacher);

  // ── Raised Hands (Firestore) ──
  const { raisedHands, hasRaisedHand, raiseHand, lowerHand, dismissHand, clearAll } = useRaisedHands(classId, userObj, isTeacher);

  // ── UI state ──
  const [isFullscreen, setIsFullscreen]   = useState(false);
  const [classEndedModal, setClassEndedModal] = useState(false);
  const containerRef = useRef(null);

  // ── Auto-enroll student when they visit class link ──
  useEffect(() => {
    if (!classId || !currentUser || isTeacher) return;
    const alreadyEnrolled = userProfile?.enrolledClasses?.includes(classId);
    if (!alreadyEnrolled) {
      import('firebase/firestore').then(({ arrayUnion, updateDoc, doc: fsDoc }) => {
        updateDoc(fsDoc(db, 'users', currentUser.uid), {
          enrolledClasses: arrayUnion(classId),
        }).catch(console.error);
      });
    }
  }, [classId, currentUser?.uid, isTeacher, userProfile]);

  // ── Attendance: write join time on mount ──
  useEffect(() => {
    if (!classId || !currentUser) return;
    const joinTime = new Date();
    joinTimeRef.current = joinTime;

    setDoc(doc(db, 'classes', classId, 'attendance', currentUser.uid), {
      userId:    currentUser.uid,
      name:      userProfile?.name || 'Unknown',
      role:      userProfile?.role || 'student',
      joinTime:  serverTimestamp(),
      leaveTime: null,
      totalDuration: null,
    }, { merge: true }).catch(console.error);

    return () => {
      writeLeaveTime(classId, currentUser.uid, joinTime);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, currentUser?.uid]);

  // ── Attendance: also write on beforeunload (tab close) ──
  useEffect(() => {
    if (!classId || !currentUser) return;
    const handleBeforeUnload = () => {
      if (joinTimeRef.current) {
        writeLeaveTime(classId, currentUser.uid, joinTimeRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [classId, currentUser]);

  // ── Class ended socket event → show modal for students ──
  useEffect(() => {
    if (connectionStatus === 'failed' && !isTeacher) {
      setClassEndedModal(true);
    }
  }, [connectionStatus, isTeacher]);

  // ── Fullscreen ──
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Leave class ──
  const handleLeave = useCallback(() => {
    stopLocalStream();
    navigate('/dashboard');
  }, [stopLocalStream, navigate]);

  // ── End class (teacher) ──
  const handleEndClass = useCallback(async () => {
    endClass();
    // Mark class as not live in Firestore
    try {
      await updateDoc(doc(db, 'classes', classId), { isLive: false });
    } catch {}
    stopLocalStream();
    navigate('/dashboard');
  }, [classId, endClass, stopLocalStream, navigate]);

  // ── Raise hand ──
  const toggleRaiseHand = useCallback(async () => {
    if (hasRaisedHand) { await lowerHand(); }
    else                { await raiseHand(); }
  }, [hasRaisedHand, raiseHand, lowerHand]);

  // ── Loading guard ──
  if (!userObj) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080f1a', color: '#56CCF2', flexDirection: 'column', gap: '12px', fontFamily: "'Inter',sans-serif" }}>
        <Spinner /> Loading session...
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#080f1a', fontFamily: "'Inter',sans-serif", overflow: 'hidden' }}>

      {/* ── Top Bar ── */}
      {!isFullscreen && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 20px',
          background: 'rgba(8,15,26,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#2F80ED,#56CCF2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🎓 Learnwood Coaching
            </span>
            <span style={{ color: '#334155', margin: '0 8px' }}>·</span>
            <span style={{ color: '#56CCF2', fontWeight: 600, fontSize: '0.9rem' }}>Class #{classId}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {userObj.name} · <span style={{ color: isTeacher ? '#a78bfa' : '#56CCF2' }}>{isTeacher ? 'Teacher' : 'Student'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Area ── */}
      <div className="live-class-wrapper">

        {/* Video Section */}
        <div style={{ flex: isFullscreen ? 1 : '1 1 auto', padding: isFullscreen ? 0 : '12px', display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          <div style={{ flex: 1, borderRadius: isFullscreen ? 0 : '12px', overflow: 'hidden' }}>
            <VideoPlayer
              stream={isTeacher ? localStream : remoteStream}
              isMuted={isTeacher}
              isTeacher={isTeacher && !!localStream}
              connectionStatus={connectionStatus}
            />
          </div>

          {/* Raised hand queue (floats over teacher video) */}
          {isTeacher && (
            <div style={{ position: 'absolute', top: '24px', left: '24px', width: '320px', zIndex: 50, pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'auto' }}>
                <RaisedHandQueue 
                  queue={raisedHands} 
                  onDismiss={dismissHand} 
                  onClearAll={clearAll} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        {!isFullscreen && (
          <div className="live-chat-panel">
            <ChatPanel classId={classId} currentUser={userObj} isTeacher={isTeacher} />
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <Controls
        isTeacher={isTeacher}
        isMuted={isAudioMuted}     toggleAudio={toggleAudio}
        isVideoOn={isVideoOn}      toggleVideo={toggleVideo}
        isScreenSharing={isScreenSharing} toggleScreenShare={toggleScreenShare}
        handleLeave={handleLeave}
        handleEndClass={handleEndClass}
        toggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen}
        hasRaisedHand={hasRaisedHand} toggleRaiseHand={toggleRaiseHand}
        raisedHandCount={raisedHands.length}
      />

      {/* ── Class Ended Modal (students) ── */}
      {classEndedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '40px', textAlign: 'center', color: 'white', maxWidth: '380px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h2 style={{ marginBottom: '8px' }}>Class Ended</h2>
            <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '0.9rem' }}>The teacher has ended this session. Thank you for attending!</p>
            <button onClick={handleLeave} style={{ background: 'linear-gradient(135deg,#2F80ED,#56CCF2)', border: 'none', borderRadius: '12px', padding: '13px 32px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Helpers ─── */
const writeLeaveTime = async (classId, uid, joinTime) => {
  const leaveTime = new Date();
  const totalDuration = Math.round((leaveTime - joinTime) / 1000); // seconds
  try {
    await updateDoc(doc(db, 'classes', classId, 'attendance', uid), {
      leaveTime: serverTimestamp(),
      totalDuration,
    });
  } catch {}
};

const Spinner = () => (
  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #2F80ED', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default LiveClass;
