import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 'http://localhost:5000';

const METERED_API_KEY = import.meta.env.VITE_METERED_API_KEY || '1093f5f37a7c0f35b4de598a';

// Fallback config if API fetch fails
const FALLBACK_RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: [
        "turn:global.relay.metered.ca:80?transport=udp",
        "turn:global.relay.metered.ca:80?transport=tcp",
        "turn:global.relay.metered.ca:443?transport=tcp",
        "turns:global.relay.metered.ca:443?transport=tcp",
      ],
      username:   METERED_API_KEY,
      credential: 'd50YARtUj0lclGK+',
    },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * Fetch fresh TURN credentials from the Metered REST API.
 * This returns properly authenticated short-lived credentials
 * that the TURN server will actually accept.
 */
const fetchTURNCredentials = async () => {
  // Try the Metered REST API to get fresh TURN credentials
  // The app name in the URL comes from your Metered dashboard (e.g. "learnwood")
  const appName = import.meta.env.VITE_METERED_APP_NAME || 'learnwood_turn';
  try {
    const resp = await fetch(
      `https://${appName}.metered.live/api/v1/turn/credentials?apiKey=${METERED_API_KEY}`
    );
    if (!resp.ok) throw new Error(`Metered API responded ${resp.status}`);
    const iceServers = await resp.json();
    console.log('[TURN] Fetched fresh credentials from Metered API:', iceServers);
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        ...iceServers,
      ],
      iceCandidatePoolSize: 10,
    };
  } catch (err) {
    console.warn('[TURN] Failed to fetch from Metered API, using fallback:', err.message);
    return FALLBACK_RTC_CONFIG;
  }
};

/**
 * useWebRTC — manages the entire WebRTC lifecycle.
 *
 * Teacher acts as broadcaster: creates a PeerConnection per student.
 * Student acts as receiver:   creates one PeerConnection to the teacher.
 */
const useWebRTC = (classId, currentUser, isTeacher) => {
  const [localStream,  setLocalStream]  = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOn,    setIsVideoOn]    = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [participantCount, setParticipantCount] = useState(0);

  const socketRef         = useRef(null);
  const peerConnections   = useRef({});      // teacher: { socketId → RTCPeerConnection }
  const socketToUser      = useRef({});      // teacher: { socketId → userId }
  const studentPC         = useRef(null);    // student: single RTCPeerConnection
  const localStreamRef    = useRef(null);    // keep in sync with state for callbacks
  const pendingCandidates = useRef({});      // queue ICE candidates before remote desc is set
  const rtcConfigRef      = useRef(FALLBACK_RTC_CONFIG); // will be updated with fresh creds

  // ── Helper: add buffered ICE candidates after remote desc is set ──
  const flushCandidates = async (pc, socketId) => {
    const queued = pendingCandidates.current[socketId] || [];
    if (queued.length > 0) {
       console.log(`[WebRTC] Flushing ${queued.length} queued ICE candidates for ${socketId}`);
    }
    for (const c of queued) {
      try { 
        await pc.addIceCandidate(new RTCIceCandidate(c)); 
        console.log(`[WebRTC] Successfully added queued ICE candidate for ${socketId}`);
      } catch (e) {
        console.error(`[WebRTC] Failed to add queued candidate for ${socketId}:`, e);
      }
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
        console.log('[WebRTC] Local media stream obtained successfully.');
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

    if (isTeacher && !localStream) {
      setConnectionStatus('waiting for camera...');
      return;
    }

    setConnectionStatus('connecting');

    const socket = io(SIGNALING_URL, { transports: ['websocket', 'polling'], reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on('connect', async () => {
      console.log(`[Signaling] Socket connected: ${socket.id}`);
      
      // Fetch fresh TURN credentials before joining room
      try {
        const config = await fetchTURNCredentials();
        rtcConfigRef.current = config;
        console.log('[TURN] Setup complete. Joining room...');
      } catch (err) {
        console.warn('[TURN] Using fallback credentials due to fetch error');
      }

      socket.emit('join-room', classId, currentUser.uid, currentUser.role, socket.id);
      if (isTeacher) {
        setConnectionStatus('connected'); // Teacher ready
        console.log(`[Signaling] Teacher joined room ${classId}, waiting for students...`);
      } else {
        setConnectionStatus('waiting'); // Student waiting
        console.log(`[Signaling] Student joined room ${classId}, waiting for WebRTC offer...`);
      }
    });

    socket.on('disconnect', () => {
      console.warn('[Signaling] Socket disconnected');
      setConnectionStatus('reconnecting');
    });

    socket.on('reconnect',  () => {
      console.log('[Signaling] Socket reconnected');
      socket.emit('join-room', classId, currentUser.uid, currentUser.role, socket.id);
    });

    socket.on('participant-count', (count) => {
      setParticipantCount(count);
    });

    // ── Teacher: a student joined → create offer ──
    socket.on('user-connected', async (userId, role, studentSocketId) => {
      if (!isTeacher || role !== 'student') return;
      console.log(`[WebRTC] Student connected (ID: ${userId}, Socket: ${studentSocketId}). Initializing connection...`);

      const pc = new RTCPeerConnection({
  ...rtcConfigRef.current,
  iceTransportPolicy: 'all' // or 'relay' for strict TURN testing
});
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });
      peerConnections.current[studentSocketId] = pc;
      socketToUser.current[studentSocketId]    = userId;

      localStreamRef.current?.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });

      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          const type = evt.candidate.candidate.split(' ')[7] || '?';
          console.log(`[ICE] Teacher candidate type=${type}:`, evt.candidate.candidate);
          socket.emit('ice-candidate', { target: studentSocketId, candidate: evt.candidate });
        } else {
          console.log(`[WebRTC] Teacher finished gathering ICE candidates for ${studentSocketId}`);
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`[WebRTC] Connection state (Teacher -> Student ${studentSocketId}): ${pc.connectionState}`);
        if (pc.connectionState === 'connected') setConnectionStatus('connected');
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`[WebRTC] ICE Connection state (Teacher -> Student ${studentSocketId}): ${pc.iceConnectionState}`);
      };

      pc.onsignalingstatechange = () => {
        console.log(`[WebRTC] Signaling state (Teacher -> Student ${studentSocketId}): ${pc.signalingState}`);
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log(`[WebRTC] Offer created and set as local description. Sending to student ${studentSocketId}`);
        socket.emit('offer', { target: studentSocketId, callerSocketId: socket.id, sdp: pc.localDescription });
      } catch (err) {
        console.error('[WebRTC] Offer creation failed:', err);
      }
    });

    // ── Student: receives offer from teacher ──
    socket.on('offer', async (payload) => {
      if (isTeacher) return;
      console.log(`[WebRTC] Received offer from teacher socket: ${payload.callerSocketId}`);

      const pc = new RTCPeerConnection(rtcConfigRef.current);
      studentPC.current = pc;

      pc.ontrack = (evt) => {
        console.log('[WebRTC] Received remote track from teacher!');
        setRemoteStream(evt.streams[0]);
        setConnectionStatus('connected');
      };

      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          const type = evt.candidate.candidate.split(' ')[7] || '?';
          console.log(`[ICE] Student candidate type=${type}:`, evt.candidate.candidate);
          socket.emit('ice-candidate', { target: payload.callerSocketId, candidate: evt.candidate });
        } else {
          console.log(`[WebRTC] Student finished gathering ICE candidates`);
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`[WebRTC] Connection state (Student -> Teacher): ${pc.connectionState}`);
        if (pc.connectionState === 'connected') {
  setConnectionStatus('connected');
} else if (pc.connectionState === 'failed') {
  setConnectionStatus('failed');
} else if (pc.connectionState === 'disconnected') {
  setConnectionStatus('reconnecting');
}
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`[WebRTC] ICE Connection state (Student -> Teacher): ${pc.iceConnectionState}`);
      };

      pc.onsignalingstatechange = () => {
        console.log(`[WebRTC] Signaling state (Student -> Teacher): ${pc.signalingState}`);
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        console.log('[WebRTC] Successfully set remote description from offer');
        
        await flushCandidates(pc, payload.callerSocketId);
        
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log(`[WebRTC] Answer created and set. Sending to teacher: ${payload.callerSocketId}`);
        socket.emit('answer', { target: payload.callerSocketId, callerSocketId: socket.id, sdp: pc.localDescription });
      } catch (err) {
        console.error('[WebRTC] Answer creation failed:', err);
      }
    });

    // ── Teacher: receives answer from student ──
    socket.on('answer', async (payload) => {
      if (!isTeacher) return;
      console.log(`[WebRTC] Received answer from student socket: ${payload.callerSocketId}`);
      
      const pc = peerConnections.current[payload.callerSocketId];
      if (!pc) {
        console.warn(`[WebRTC] Received answer for unknown student PC: ${payload.callerSocketId}`);
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        console.log(`[WebRTC] Teacher set remote description array. Processing buffered candidates...`);
        await flushCandidates(pc, payload.callerSocketId);
        setConnectionStatus('connected');
      } catch (err) {
        console.error('[WebRTC] Setting remote answer failed:', err);
      }
    });

    // ── ICE candidates (both sides) ──
    socket.on('ice-candidate', async ({ fromSocketId, candidate }) => {
      console.log(`[WebRTC] Ice candidate received from network: ${fromSocketId}`);
      try {
        if (isTeacher) {
          const pc = peerConnections.current[fromSocketId];
          if (pc) {
            if (pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log(`[WebRTC] Added ICE candidate to PC for student ${fromSocketId}`);
            } else {
              console.log(`[WebRTC] Buffering ICE candidate for student ${fromSocketId}`);
              pendingCandidates.current[fromSocketId] = [
                ...(pendingCandidates.current[fromSocketId] || []),
                candidate,
              ];
            }
          }
        } else {
          if (studentPC.current && studentPC.current.remoteDescription) {
             await studentPC.current.addIceCandidate(new RTCIceCandidate(candidate));
             console.log(`[WebRTC] Added ICE candidate to PC from teacher ${fromSocketId}`);
          } else {
             console.log(`[WebRTC] Buffering ICE candidate from teacher ${fromSocketId}`);
             // FIX: Buffer using the actual socket ID (fromSocketId), not literal string 'teacher' !
             pendingCandidates.current[fromSocketId] = [
                ...(pendingCandidates.current[fromSocketId] || []),
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
      console.log(`[Signaling] User disconnected: ${userId} (${studentSocketId})`);
      if (isTeacher && peerConnections.current[studentSocketId]) {
        peerConnections.current[studentSocketId].close();
        delete peerConnections.current[studentSocketId];
        delete socketToUser.current[studentSocketId];
      }
    });

    // ── Class ended by teacher ──
    socket.on('class-ended', () => {
      console.log(`[Signaling] Class marked as ended by teacher`);
      setConnectionStatus('failed');
    });

    return () => {
      socket.disconnect();
      Object.values(peerConnections.current).forEach(pc => pc.close());
      studentPC.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, currentUser?.uid, isTeacher, localStream]);

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
    participantCount,
    socket: socketRef.current,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endClass,
    stopLocalStream,
  };
};

export default useWebRTC;
