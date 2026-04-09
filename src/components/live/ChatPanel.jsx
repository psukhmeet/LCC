import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiTrash2, FiMapPin, FiMessageSquare, FiHelpCircle, FiVolume2 } from 'react-icons/fi';
import { format } from 'date-fns';
import useChat from '../../hooks/useChat';

const TYPE_OPTIONS = [
  { value: 'text',         label: 'Chat',         icon: <FiMessageSquare /> },
  { value: 'question',     label: 'Question',      icon: <FiHelpCircle /> },
  { value: 'announcement', label: 'Announce',      icon: <FiVolume2 /> },
];

const TYPE_STYLES = {
  text:         { borderColor: 'transparent',             labelColor: '#94a3b8', bg: 'rgba(255,255,255,0.07)' },
  question:     { borderColor: 'rgba(251,191,36,0.5)',    labelColor: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
  announcement: { borderColor: 'rgba(167,139,250,0.5)',   labelColor: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
};

const ChatPanel = ({ classId, currentUser, isTeacher }) => {
  const { messages, chatError, sendMessage, pinMessage, deleteMessage } = useChat(classId, currentUser, isTeacher);
  const [newMessage, setNewMessage] = useState('');
  const [msgType, setMsgType]       = useState('text');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage(newMessage, msgType);
    setNewMessage('');
  };

  const pinnedMsgs = messages.filter(m => m.isPinned);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'rgba(8,15,26,0.85)',
      backdropFilter: 'blur(12px)',
      borderLeft: '1px solid rgba(255,255,255,0.07)',
      color: 'white',
    }}>
      {/* ─── Header ─── */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>💬 Live Chat</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{messages.length} messages</div>
      </div>

      {/* ─── Error banner ─── */}
      {chatError && (
        <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)', fontSize: '0.8rem', color: '#fca5a5' }}>
          ⚠️ {chatError}
        </div>
      )}

      {/* ─── Pinned Messages ─── */}
      {pinnedMsgs.length > 0 && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {pinnedMsgs.map(m => (
            <div key={`pin-${m.id}`} style={{ background: 'rgba(47,128,237,0.12)', borderLeft: '3px solid #2F80ED', padding: '8px 10px', borderRadius: '0 8px 8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#56CCF2', marginBottom: '3px' }}>
                <FiMapPin size={10} /> Pinned
              </div>
              <div style={{ fontSize: '0.82rem' }}>{m.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Messages ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#334155', padding: '40px 0', fontSize: '0.85rem' }}>
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map(msg => {
          const isOwn  = msg.senderId === currentUser?.uid;
          const ts     = msg.styles;
          const typeStyle = TYPE_STYLES[msg.type] || TYPE_STYLES.text;

          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {/* Sender row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isOwn ? '#56CCF2' : (msg.senderRole === 'teacher' ? '#a78bfa' : '#94a3b8') }}>
                  {msg.senderName}
                  {msg.senderRole === 'teacher' && (
                    <span style={{ marginLeft: '4px', fontSize: '0.65rem', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '4px', padding: '1px 5px', color: '#a78bfa' }}>TEACHER</span>
                  )}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#334155' }}>
                  {msg.timestamp ? format(msg.timestamp.toDate(), 'HH:mm') : ''}
                </span>
              </div>

              {/* Bubble row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', flexDirection: isOwn ? 'row-reverse' : 'row' }}>
                <div style={{
                  maxWidth: '82%', padding: '8px 12px', borderRadius: isOwn ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  background: isOwn ? 'rgba(47,128,237,0.25)' : typeStyle.bg,
                  border: `1px solid ${isOwn ? 'rgba(47,128,237,0.3)' : typeStyle.borderColor}`,
                  fontSize: '0.875rem', lineHeight: 1.5, wordBreak: 'break-word',
                }}>
                  {msg.type !== 'text' && (
                    <div style={{ fontSize: '0.68rem', color: typeStyle.labelColor, marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                      {msg.type === 'question' ? '❓ Question' : '📢 Announcement'}
                    </div>
                  )}
                  {msg.text}
                </div>

                {/* Teacher actions */}
                {isTeacher && (
                  <div style={{ display: 'flex', gap: '4px', opacity: 0.6 }}>
                    <ActionBtn onClick={() => pinMessage(msg.id, msg.isPinned)} title={msg.isPinned ? 'Unpin' : 'Pin'} active={msg.isPinned}>
                      <FiMapPin size={12} />
                    </ActionBtn>
                    <ActionBtn onClick={() => deleteMessage(msg.id)} title="Delete" danger>
                      <FiTrash2 size={12} />
                    </ActionBtn>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input ─── */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Message type selector (teacher gets announcements too) */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {TYPE_OPTIONS.filter(t => isTeacher || t.value !== 'announcement').map(opt => (
            <button key={opt.value} onClick={() => setMsgType(opt.value)} style={{
              flex: 1, padding: '5px', border: `1px solid ${msgType === opt.value ? '#2F80ED' : 'rgba(255,255,255,0.1)'}`,
              background: msgType === opt.value ? 'rgba(47,128,237,0.2)' : 'transparent',
              borderRadius: '8px', color: msgType === opt.value ? '#56CCF2' : '#64748b',
              fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.15s',
            }}>
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder={msgType === 'question' ? 'Ask a question...' : msgType === 'announcement' ? 'Type an announcement...' : 'Type a message...'}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <button type="submit" disabled={!newMessage.trim()} style={{
            background: newMessage.trim() ? 'linear-gradient(135deg, #2F80ED, #56CCF2)' : 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: '10px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
          }}>
            <FiSend size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

const ActionBtn = ({ onClick, title, active, danger, children }) => (
  <button onClick={onClick} title={title} style={{
    background: active ? 'rgba(47,128,237,0.2)' : danger ? 'rgba(239,68,68,0.1)' : 'transparent',
    border: 'none', color: active ? '#56CCF2' : danger ? '#ef4444' : '#94a3b8',
    borderRadius: '6px', width: '22px', height: '22px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  }}>{children}</button>
);

export default ChatPanel;
