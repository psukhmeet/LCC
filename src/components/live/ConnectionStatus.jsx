import React from 'react';

const STATUS_MAP = {
  idle:         { label: 'Idle',         color: '#64748b', dot: '#64748b' },
  connecting:   { label: 'Connecting',   color: '#f59e0b', dot: '#f59e0b' },
  waiting:      { label: 'Waiting',      color: '#60a5fa', dot: '#60a5fa' },
  connected:    { label: 'Connected',    color: '#4ade80', dot: '#4ade80' },
  reconnecting: { label: 'Reconnecting', color: '#f97316', dot: '#f97316' },
  failed:       { label: 'Disconnected', color: '#ef4444', dot: '#ef4444' },
};

const ConnectionStatus = ({ status }) => {
  const cfg = STATUS_MAP[status] || STATUS_MAP.idle;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      border: `1px solid ${cfg.color}44`,
      padding: '4px 10px', borderRadius: '20px',
      fontSize: '0.72rem', fontWeight: 600, color: cfg.color,
    }}>
      <span style={{
        width: '7px', height: '7px', borderRadius: '50%',
        background: cfg.dot,
        boxShadow: `0 0 6px ${cfg.dot}`,
        animation: status === 'connecting' || status === 'reconnecting' ? 'blink 1s infinite' : 'none',
        display: 'inline-block',
      }} />
      {cfg.label}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
};

export default ConnectionStatus;
