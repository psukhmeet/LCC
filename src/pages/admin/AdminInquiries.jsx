import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, CheckCircle, RefreshCcw, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleMarkRead = async (id, currentRead) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { read: !currentRead });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: !currentRead } : i));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanent delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) { alert(err.message); }
  };

  const filtered = inquiries.filter(i => {
    if (filter === 'unread') return !i.read;
    if (filter === 'read') return i.read;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Message Inbox</h1>
          <p style={{ color: '#64748B', margin: 0 }}>View and manage inquiries sent through the website contact form.</p>
        </div>
        <button 
          onClick={fetchInquiries}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', background: 'white', padding: '6px', borderRadius: '14px', width: 'fit-content', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: filter === f ? 'var(--primary)' : 'transparent',
              color: filter === f ? 'white' : '#64748B',
              transition: 'all 0.2s'
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({inquiries.filter(i => f==='all'?true : f==='unread'?!i.read:i.read).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence>
          {filtered.map((inq) => (
            <motion.div
              key={inq.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ 
                background: inq.read ? 'rgba(255,255,255,0.6)' : 'white',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: inq.read ? 'none' : '0 10px 30px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: '24px',
                opacity: inq.read ? 0.7 : 1
              }}
            >
              <div style={{ 
                width: '50px', height: '50px', borderRadius: '14px', 
                background: inq.read ? '#CBD5E1' : 'var(--primary)', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Mail size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{inq.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94A3B8' }}>
                      <Clock size={14} /> 
                      {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </div>
                    {!inq.read && <span style={{ background: 'rgba(47,128,237,0.1)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>NEW MESSAGE</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '0.85rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}><Phone size={14} /> {inq.phone}</div>
                   {inq.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}><Mail size={14} /> {inq.email}</div>}
                </div>

                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-dark)', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px' }}>
                  {inq.message}
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    onClick={() => handleMarkRead(inq.id, inq.read)}
                    style={{ 
                      padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '6px', color: inq.read ? '#94A3B8' : 'var(--primary)'
                    }}
                  >
                    <CheckCircle size={16} /> {inq.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button 
                    onClick={() => handleDelete(inq.id)}
                    style={{ 
                      padding: '8px 16px', borderRadius: '10px', border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444'
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <p style={{ color: '#94A3B8' }}>No messages found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
