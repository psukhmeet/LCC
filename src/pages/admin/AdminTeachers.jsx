import { useState, useEffect } from 'react';
import { UserCheck, Plus, Trash2, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchTeachers = async () => {
    setFetchLoading(true);
    try {
      const snap = await getDocs(collection(db, 'authorizedTeachers'));
      setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setFetchLoading(false); }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'authorizedTeachers', email), { email, addedAt: new Date().toISOString() });
      setNewEmail('');
      await fetchTeachers();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleRemove = async (email) => {
    if (!window.confirm(`Remove authorization for ${email}?`)) return;
    try {
      await deleteDoc(doc(db, 'authorizedTeachers', email));
      await fetchTeachers();
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Teacher Authorization</h1>
        <p style={{ color: '#64748B', margin: 0 }}>Authorize Google accounts to have the "Teacher" role on the platform.</p>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '15px', background: 'rgba(47, 128, 237, 0.05)', padding: '20px', borderRadius: '16px', marginBottom: '30px', border: '1px solid rgba(47, 128, 237, 0.1)' }}>
          <ShieldCheck color="var(--primary)" size={32} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>Security Protocol</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              Only users added to this list will be granted instructor privileges when logging in with Google. 
              This ensures your live classroom remains secure and invitation-only.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input 
              type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              placeholder="Enter teacher's gmail address" required 
              style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0 24px', borderRadius: '14px', fontWeight: 700 }}>
            {loading ? 'Adding...' : 'Authorize Email'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>Currently Authorized</h4>
          {fetchLoading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>Checking database...</p>
          ) : teachers.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>No teachers authorized yet.</p>
          ) : (
            teachers.map(t => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                    {t.email[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{t.email}</span>
                </div>
                <button 
                  onClick={() => handleRemove(t.email)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers;
