import React, { useEffect, useRef } from 'react';
import ConnectionStatus from './ConnectionStatus';

const VideoPlayer = ({ stream, isMuted, isTeacher, connectionStatus }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#080f1a',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* ─── Video element ─── */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        style={{
          width: '100%',
          height: '100%',
          objectFit: stream ? 'contain' : 'cover',
          display: stream ? 'block' : 'none',
          background: '#080f1a',
        }}
      />

      {/* ─── Overlay states ─── */}
      {!stream && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '20px', color: 'white',
        }}>
          <Overlay status={connectionStatus} isTeacher={isTeacher} />
        </div>
      )}

      {/* ─── LIVE badge (teacher only) ─── */}
      {isTeacher && stream && (
        <div style={{
          position: 'absolute', top: '16px', left: '16px',
          background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(4px)',
          color: 'white', padding: '4px 14px', borderRadius: '20px',
          fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'livePulse 1.2s infinite' }} />
          LIVE
        </div>
      )}

      {/* ─── Connection status badge ─── */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <ConnectionStatus status={connectionStatus} />
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
};

/* ─── Overlay content by connection state ─── */
const Overlay = ({ status, isTeacher }) => {
  const configs = {
    idle: {
      icon: '🎥',
      title: 'Getting Ready',
      sub: isTeacher ? 'Starting camera...' : 'Connecting to class...',
    },
    connecting: {
      icon: null,  // spinner
      title: 'Connecting',
      sub: 'Establishing secure connection...',
    },
    waiting: {
      icon: '⏳',
      title: 'Waiting for Teacher',
      sub: 'The class will start shortly. Please wait.',
    },
    reconnecting: {
      icon: null,
      title: 'Reconnecting',
      sub: 'Connection interrupted. Trying again...',
    },
    failed: {
      icon: '📡',
      title: 'Class Ended',
      sub: 'This session has ended. You may leave the room.',
    },
  };

  const cfg = configs[status] || configs.idle;

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease', padding: '24px' }}>
      {cfg.icon ? (
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{cfg.icon}</div>
      ) : (
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #2F80ED', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
      )}
      <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '8px', fontWeight: 700 }}>{cfg.title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '260px' }}>{cfg.sub}</p>
    </div>
  );
};

export default VideoPlayer;
