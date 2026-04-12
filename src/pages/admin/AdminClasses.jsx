import { useState, useEffect } from 'react';
import { Radio, Plus, Trash2, Copy, Check, Calendar, Type, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', scheduledTime: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchClasses = async () => {
    setFetchLoading(true);
    try {
      const snap = await getDocs(collection(db, 'classes'));
      setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) { console.error(err); }
    finally { setFetchLoading(false); }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'classes'), {
        title: form.title.trim(),
        description: form.description.trim(),
        scheduledTime: form.scheduledTime ? new Date(form.scheduledTime) : null,
        isLive: false,
        createdAt: serverTimestamp(),
      });
      setForm({ title: '', description: '', scheduledTime: '' });
      await fetchClasses();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    await deleteDoc(doc(db, 'classes', id));
    await fetchClasses();
  };

  const copyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/live/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Live Class Management</h1>
        <p style={{ color: '#64748B', margin: 0 }}>Schedule upcoming lectures and generate session links for students.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Creation Form */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={20} color="var(--primary)" /> Schedule New Class
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                <Type size={14} /> Class Title
              </label>
              <input 
                type="text" className="glass" placeholder="e.g. Organic Chemistry Crash Course" required
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                <Paperclip size={14} /> Brief Description
              </label>
              <textarea 
                className="glass" placeholder="Optional details..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', height: '100px', resize: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                <Calendar size={14} /> Schedule For
              </label>
              <input 
                type="datetime-local" className="glass"
                value={form.scheduledTime} onChange={e => setForm({...form, scheduledTime: e.target.value})}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px', borderRadius: '14px', fontWeight: 700, marginTop: '10px' }}>
              {loading ? 'Creating...' : 'Generate Class Link'}
            </button>
          </form>
        </div>

        {/* List View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Class Roadmap</h3>
          {fetchLoading ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Syncing with cloud...</p>
          ) : classes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px' }}>
               <Radio size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
               <p style={{ color: '#94A3B8' }}>No classes scheduled yet.</p>
            </div>
          ) : (
            <AnimatePresence>
              {classes.map((cls) => (
                <motion.div 
                  key={cls.id}
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.03)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{cls.title}</h4>
                        {cls.isLive && <span style={{ background: '#EF4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px' }}>LIVE NOW</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>{cls.description || 'No description provided.'}</p>
                    </div>
                    <button onClick={() => handleDelete(cls.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'monospace', background: '#F8FAFC', padding: '6px 12px', borderRadius: '8px' }}>
                      /live/{cls.id}
                    </div>
                    <button 
                      onClick={() => copyLink(cls.id)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', 
                        border: '1px solid var(--primary)', background: copiedId === cls.id ? 'var(--primary)' : 'white',
                        color: copiedId === cls.id ? 'white' : 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {copiedId === cls.id ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminClasses;
