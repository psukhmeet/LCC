import { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Bell, Send, Trash2, Info, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminNotifications = () => {
  const { data } = useContext(DataContext);
  const [newNote, setNewNote] = useState({ title: '', message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.message) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        ...newNote,
        createdAt: serverTimestamp()
      });
      setNewNote({ title: '', message: '', type: 'info' });
      alert('Notification broadcasted successfully!');
    } catch (err) {
      alert('Failed to send: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification? It will disappear for all users.')) return;
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Broadcast Center</h1>
        <p style={{ color: '#64748B', margin: 0 }}>Create real-time notifications for all users on the platform.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 1.5fr', 
        gap: '30px' 
      }}>
        
        {/* Creation Form */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Send size={18} color="var(--primary)" /> New Broadcast
          </h3>
          
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Title</label>
              <input 
                type="text" 
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                placeholder="Batch Update / Result Out"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Message</label>
              <textarea 
                rows="4"
                value={newNote.message}
                onChange={(e) => setNewNote({...newNote, message: e.target.value})}
                placeholder="Important detail for students..."
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', resize: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Priority Level</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['info', 'alert', 'success'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewNote({...newNote, type})}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer',
                      background: newNote.type === type ? (type === 'alert' ? '#FEF2F2' : type === 'success' ? '#F0FDF4' : '#EFF6FF') : 'white',
                      borderColor: newNote.type === type ? (type === 'alert' ? '#EF4444' : type === 'success' ? '#22C55E' : 'var(--primary)') : '#E2E8F0',
                      color: newNote.type === type ? (type === 'alert' ? '#EF4444' : type === 'success' ? '#166534' : 'var(--primary)') : '#64748B',
                      fontWeight: 700, textTransform: 'capitalize', fontSize: '0.8rem'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '10px', padding: '14px' }}
            >
              {loading ? 'Sending...' : 'Broadcast to All Users'}
            </button>
          </form>
        </div>

        {/* History Area */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Clock size={18} color="#64748B" /> Sent History
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {(data.notifications || []).map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #F1F5F9',
                    background: '#F8FAFC',
                    position: 'relative'
                  }}
                >
                  <button 
                    onClick={() => handleDelete(note.id)}
                    style={{ position: 'absolute', top: '20px', right: '20px', color: '#94A3B8', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      padding: '10px', borderRadius: '10px', 
                      background: note.type === 'alert' ? '#FEE2E2' : note.type === 'success' ? '#DCFCE7' : 'white',
                      color: note.type === 'alert' ? '#EF4444' : note.type === 'success' ? '#22C55E' : 'var(--primary)'
                    }}>
                      {note.type === 'alert' ? <AlertTriangle size={18} /> : note.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700 }}>{note.title}</h4>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{note.message}</p>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Sent {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(!data.notifications || data.notifications.length === 0) && (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Bell size={40} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>No notifications sent yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminNotifications;
