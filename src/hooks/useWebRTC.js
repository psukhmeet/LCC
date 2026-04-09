import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 'http://localhost:5000';

const buildRTCConfig = () => ({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: [
        `turn:${import.meta.env.VITE_TURN_SERVER_URL}:3478?transport=udp`,
        `turn:${import.meta.env.VITE_TURN_SERVER_URL}:3478?transport=tcp`,
        `turns:${import.meta.env.VITE_TURN_SERVER_URL}:443?transport=tcp`,
      ],
      username:   import.meta.env.VITE_TURN_USERNAME   || 'openrelayproject',
      credential: import.meta.env.VITE_TURN_CREDENTIAL || 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
});

/**
 * useWebRTC — manages the entire WebRTC lifecycle.
 *
 * Teacher acts as broadcaster: creates a PeerConnection per student.
 * Student acts as receiver:   creates one PeerConnection to the teacher.
 *
 * Key fix over MVP: we maintain a socketId↔userId map so ICE candidates
 * reach the correct RTCPeerConnection on the teacher side.
 */
const useWebRTC = (classId, currentUser, isTeacher) => {
  const [localStream,  setLocalStream]  = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOn,    setIsVideoOn]    = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle | connecting | connected | reconnecting | failed

  const socketRef         = useRef(null);
  const peerConnections   = useRef({});      // teacher: { socketId → RTCPeerConnection }
  const socketToUser      = useRef({});      // teacher: { socketId → userId }
  const studentPC         = useRef(null);    // student: single RTCPeerConnection
  const localStreamRef    = useRef(null);    // keep in sync with state for callbacks
  const pendingCandidates = useRef({});      // queue ICE candidates before remote desc is set

  const rtcConfig = buildRTCConfig();

  // ── Helper: add buffered ICE candidates after remote desc is set ──
  const flushCandidates = async (pc, socketId) => {
    const queued = pendingCandidates.current[socketId] || [];
    for (const c of queued) {
      try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
    }
    delete pendingCandidates.current[socketId];
  };

  // ── Init local stream (teacher only) ──
  useEffect(() => {
    if (!isTeacher) return;
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localStreamRef.current = stream;
      } catch (err) {
        console.error('[WebRTC] Camera/mic access denied:', err);
        setConnectionStatus('failed');
      }
    };
    getMedia();
    return () => {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [isTeacher]);

  // ── Init socket & WebRTC signaling ──
  useEffect(() => {
    if (!classId || !currentUser) return;

    // Critical Fix: Teacher must wait until they approved camera permissions! 
    // Otherwise they send empty video streams to students.
    if (isTeacher && !localStream) {
      setConnectionStatus('waiting for camera...');
      return;
    }

    setConnectionStatus('connecting');
    const socket = io(SIGNALING_URL, { transports: ['websocket'], reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-room', classId, currentUser.uid, currentUser.role, socket.id);
      if (!isTeacher) setConnectionStatus('waiting'); // waiting for teacher
    });

    socket.on('disconnect', () => setConnectionStatus('reconnecting'));
    socket.on('reconnect',  () => {
      socket.emit('join-room', classId, currentUser.uid, currentUser.role, socket.id);
    });

    // ── Teacher: a student joined → create offer ──
    socket.on('user-connected', async (userId, role, studentSocketId) => {
      if (!isTeacher || role !== 'student') return;

      const pc = new RTCPeerConnection(rtcConfig);
      peerConnections.current[studentSocketId] = pc;
      socketToUser.current[studentSocketId]    = userId;

      localStreamRef.current?.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });

      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          socket.emit('ice-candidate', { target: studentSocketId, candidate: evt.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') setConnectionStatus('connected');
      };

      try {
        const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
        await pc.setLocalDescription(offer);
        socket.emit('offer', { target: studentSocketId, callerSocketId: socket.id, sdp: pc.localDescription });
      } catch (err) {
        console.error('[WebRTC] Offer creation failed:', err);
      }
    });

    // ── Student: receives offer from teacher ──
    socket.on('offer', async (payload) => {
      if (isTeacher) return;

      const pc = new RTCPeerConnection(rtcConfig);
      studentPC.current = pc;

      pc.ontrack = (evt) => {
        setRemoteStream(evt.streams[0]);
        setConnectionStatus('connected');
      };

      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          socket.emit('ice-candidate', { target: payload.callerSocketId, candidate: evt.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setConnectionStatus('reconnecting');
        }
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        await flushCandidates(pc, payload.callerSocketId);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { target: payload.callerSocketId, callerSocketId: socket.id, sdp: pc.localDescription });
      } catch (err) {
        console.error('[WebRTC] Answer creation failed:', err);
      }
    });

    // ── Teacher: receives answer from student ──
    socket.on('answer', async (payload) => {
      if (!isTeacher) return;
      const pc = peerConnections.current[payload.callerSocketId];
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        await flushCandidates(pc, payload.callerSocketId);
        setConnectionStatus('connected');
      } catch (err) {
        console.error('[WebRTC] Setting remote answer failed:', err);
      }
    });

    // ── ICE candidates (both sides) ──
    socket.on('ice-candidate', async ({ fromSocketId, candidate }) => {
      try {
        if (isTeacher) {
          const pc = peerConnections.current[fromSocketId];
          if (pc) {
            if (pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
              pendingCandidates.current[fromSocketId] = [
                ...(pendingCandidates.current[fromSocketId] || []),
                candidate,
              ];
            }
          }
        } else if (studentPC.current) {
          if (studentPC.current.remoteDescription) {
            await studentPC.current.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            pendingCandidates.current['teacher'] = [
              ...(pendingCandidates.current['teacher'] || []),
              candidate,
            ];
          }
        }
      } catch (err) {
        console.error('[WebRTC] ICE error:', err);
      }
    });

    // ── Student disconnected ──
    socket.on('user-disconnected', (userId, studentSocketId) => {
      if (isTeacher && peerConnections.current[studentSocketId]) {
        peerConnections.current[studentSocketId].close();
        delete peerConnections.current[studentSocketId];
        delete socketToUser.current[studentSocketId];
      }
    });

    // ── Class ended by teacher ──
    socket.on('class-ended', () => {
      setConnectionStatus('failed');
    });

    return () => {
      socket.disconnect();
      Object.values(peerConnections.current).forEach(pc => pc.close());
      studentPC.current?.close();
    };
  }, [classId, currentUser, isTeacher, localStream]);

  // ── Audio toggle ──
  const toggleAudio = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsAudioMuted(!track.enabled);
  }, []);

  // ── Video toggle ──
  const toggleVideo = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsVideoOn(track.enabled);
  }, []);

  // ── Screen share toggle ──
  const toggleScreenShare = useCallback(async () => {
    if (!isTeacher) return;

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        const videoTrack   = screenStream.getVideoTracks()[0];

        // Replace video track in all peer connections
        for (const pc of Object.values(peerConnections.current)) {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) await sender.replaceTrack(videoTrack);
        }

        // Swap video track in localStream
        const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];
        oldVideoTrack?.stop();
        localStreamRef.current?.removeTrack(oldVideoTrack);
        localStreamRef.current?.addTrack(videoTrack);
        setLocalStream(new MediaStream(localStreamRef.current?.getTracks()));
        setIsScreenSharing(true);

        videoTrack.onended = () => toggleScreenShare(); // browser "Stop sharing" button
      } else {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const cameraTrack  = cameraStream.getVideoTracks()[0];

        const oldTrack = localStreamRef.current?.getVideoTracks()[0];
        oldTrack?.stop();

        for (const pc of Object.values(peerConnections.current)) {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) await sender.replaceTrack(cameraTrack);
        }

        localStreamRef.current?.removeTrack(oldTrack);
        localStreamRef.current?.addTrack(cameraTrack);
        setLocalStream(new MediaStream(localStreamRef.current?.getTracks()));
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('[WebRTC] Screen share error:', err);
    }
  }, [isTeacher, isScreenSharing]);

  // ── End class (teacher only) ──
  const endClass = useCallback(() => {
    socketRef.current?.emit('end-class', classId);
  }, [classId]);

  // ── Stop all local tracks (call on leave) ──
  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  return {
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoOn,
    isScreenSharing,
    connectionStatus,
    socket: socketRef.current,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endClass,
    stopLocalStream,
  };
};

export default useWebRTC;
