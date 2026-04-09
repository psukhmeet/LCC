import React, { useState } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMonitor, FiMaximize, FiMinimize, FiLogOut, FiStopCircle } from 'react-icons/fi';
import { MdFrontHand } from 'react-icons/md';

const Controls = ({
  isTeacher,
  isMuted, toggleAudio,
  isVideoOn, toggleVideo,
  isScreenSharing, toggleScreenShare,
  handleLeave,
  handleEndClass,
  toggleFullscreen, isFullscreen,
  hasRaisedHand, toggleRaiseHand,
  raisedHandCount,
}) => {
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  return (
    <div style={{
      backgroundColor: 'rgba(8,15,26,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: 'white',
      flexWrap: 'wrap',
      justifyContent: 'center',
      position: 'relative',
    }}>

      {/* ── Teacher Controls ── */}
      {isTeacher && (
        <>
          <CtrlBtn active={!isMuted} onClick={toggleAudio}
            icon={isMuted ? <FiMicOff /> : <FiMic />}
            label={isMuted ? 'Unmute' : 'Mute'}
          />
          <CtrlBtn active={isVideoOn} onClick={toggleVideo}
            icon={isVideoOn ? <FiVideo /> : <FiVideoOff />}
            label={isVideoOn ? 'Stop Video' : 'Start Video'}
          />
          <CtrlBtn active={isScreenSharing} onClick={toggleScreenShare}
            icon={<FiMonitor />}
            label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            activeColor="#8b5cf6"
          />

          {/* Divider + hand count */}
          <div style={{ padding: '0 12px', borderLeft: '1px solid rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              🖐 <strong style={{ color: 'white' }}>{raisedHandCount || 0}</strong> raised
            </span>
          </div>
        </>
      )}

      {/* ── Student Controls ── */}
      {!isTeacher && (
        <CtrlBtn
          active={hasRaisedHand}
          onClick={toggleRaiseHand}
          icon={<MdFrontHand />}
          label={hasRaisedHand ? 'Lower Hand' : 'Raise Hand'}
          activeColor="#f59e0b"
        />
      )}

      {/* ── Universal ── */}
      <CtrlBtn
        onClick={toggleFullscreen}
        icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
        label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      />

      {/* ── End Class (teacher only) ── */}
      {isTeacher && (
        <>
          <button onClick={() => setShowEndConfirm(true)} style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5', padding: '10px 18px', borderRadius: '10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
            fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
          }}>
            <FiStopCircle /> End Class
          </button>

          {showEndConfirm && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            }}>
              <div style={{ background: '#1e293b', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '32px', maxWidth: '380px', textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
                <h3 style={{ marginBottom: '8px' }}>End Class for Everyone?</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
                  All students will be disconnected. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={() => setShowEndConfirm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    Cancel
                  </button>
                  <button onClick={() => { handleEndClass(); setShowEndConfirm(false); }} style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                    Yes, End Class
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Leave Class ── */}
      <button onClick={handleLeave} style={{
        background: isTeacher ? 'transparent' : 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.4)',
        color: '#fca5a5', padding: '10px 18px', borderRadius: '10px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
        fontSize: '0.875rem', fontWeight: 600, marginLeft: 'auto',
      }}>
        <FiLogOut /> Leave
      </button>
    </div>
  );
};

const CtrlBtn = ({ active, onClick, icon, label, activeColor }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      background: active ? `${activeColor || '#2F80ED'}22` : 'rgba(255,255,255,0.05)',
      color: active ? (activeColor || '#56CCF2') : '#cbd5e1',
      border: `1px solid ${active ? (activeColor || '#2F80ED') + '66' : 'rgba(255,255,255,0.12)'}`,
      borderRadius: '10px',
      width: '48px', height: '48px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.2rem', cursor: 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }}
  >
    {icon}
  </button>
);

export default Controls;
