import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { LogOut, Save, Settings, Users, BarChart, MessageSquare, Trash2, Radio, UserCheck, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminDashboard = () => {
  const { data, updateData, updateCategory, updateTutor, addTutor, removeTutor, removeMessage, resetToDefault } = useContext(DataContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update local context state
      updateCategory('general', localData.general);
      updateCategory('stats', localData.stats);
      
      // 2. Persist to Firestore for global sync
      await setDoc(doc(db, 'settings', 'website'), {
        general: localData.general,
        stats: localData.stats,
        tutors: localData.tutors,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert('Changes saved successfully! All devices will now reflect the new data.');
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save changes globally: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };


  const SidebarButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '15px', borderRadius: '10px',
        background: activeTab === id ? 'var(--primary)' : 'transparent',
        color: activeTab === id ? 'white' : 'var(--text-dark)',
        border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', transition: 'all 0.3s'
      }}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', display: 'flex', gap: '30px' }} className="container">
      {/* Sidebar */}
      <div className="glass" style={{ width: '250px', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px', height: 'fit-content' }}>
        <h3 style={{ marginBottom: '20px', paddingLeft: '15px' }}>Admin Menu</h3>
        <SidebarButton id="general"  icon={Settings}   label="General Settings" />
        <SidebarButton id="stats"    icon={BarChart}    label="Statistics" />
        <SidebarButton id="tutors"   icon={Users}       label="Tutors" />
        <SidebarButton id="messages" icon={MessageSquare} label="Inquiries" />
        <SidebarButton id="teachers" icon={UserCheck}   label="Authorized Teachers" />
        <SidebarButton id="classes"  icon={Radio}       label="Live Classes" />
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <button onClick={resetToDefault} className="btn-outline" style={{ width: '100%', marginBottom: '10px', padding: '10px' }}>Reset to Default</button>
          <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', padding: '10px', background: '#ef4444' }}>
            <LogOut size={16} style={{ marginRight: '5px' }} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass" style={{ flex: 1, padding: '40px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem' }}>
            {activeTab === 'general'  && 'General Settings'}
            {activeTab === 'stats'    && 'Statistics Settings'}
            {activeTab === 'tutors'   && 'Manage Tutors'}
            {activeTab === 'messages' && 'Contact Inquiries'}
            {activeTab === 'teachers' && 'Authorized Teachers'}
            {activeTab === 'classes'  && 'Live Classes'}
          </h2>
          {(activeTab === 'general' || activeTab === 'stats' || activeTab === 'tutors') && (
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', opacity: isSaving ? 0.7 : 1 }}
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}

        </div>

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Title</label>
              <input type="text" className="glass" style={{ width: '100%', padding: '15px' }} 
                value={localData.general.heroTitle} onChange={(e) => setLocalData({...localData, general: {...localData.general, heroTitle: e.target.value}})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Subtext</label>
              <textarea className="glass" style={{ width: '100%', padding: '15px', height: '100px' }} 
                value={localData.general.heroSubtext} onChange={(e) => setLocalData({...localData, general: {...localData.general, heroSubtext: e.target.value}})}></textarea>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Contact Phone Numbers</label>
              {(localData.general.phoneNumbers || []).map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" className="glass" style={{ width: '160px', padding: '12px' }} 
                    placeholder="Country"
                    value={p.country} 
                    onChange={(e) => {
                      const newPhones = [...localData.general.phoneNumbers];
                      newPhones[idx].country = e.target.value;
                      setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
                    }} 
                  />
                  <input type="text" className="glass" style={{ flex: 1, padding: '12px' }} 
                    placeholder="Number"
                    value={p.number} 
                    onChange={(e) => {
                      const newPhones = [...localData.general.phoneNumbers];
                      newPhones[idx].number = e.target.value;
                      setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
                    }} 
                  />
                  <button 
                    onClick={() => {
                      const newPhones = localData.general.phoneNumbers.filter((_, i) => i !== idx);
                      setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
                    }}
                    className="btn-primary" style={{ background: '#ef4444', padding: '10px 15px' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  const newPhones = [...(localData.general.phoneNumbers || []), { country: '', number: '' }];
                  setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
                }}
                className="btn-outline" style={{ padding: '8px 15px', fontSize: '0.85rem' }}
              >
                + Add Another Number
              </button>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Contact Email</label>
              <input type="email" className="glass" style={{ width: '100%', padding: '15px' }} 
                value={localData.general.email} onChange={(e) => setLocalData({...localData, general: {...localData.general, email: e.target.value}})} />
            </div>

          </motion.div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
             <div className="glass" style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Students Mentored Value</label>
              <input type="number" className="glass" style={{ width: '100%', padding: '10px' }} 
                value={localData.stats.studentsMentored} onChange={(e) => setLocalData({...localData, stats: {...localData.stats, studentsMentored: parseInt(e.target.value)}})} />
            </div>
            <div className="glass" style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Scored Above 90% Value</label>
              <input type="number" className="glass" style={{ width: '100%', padding: '10px' }} 
                value={localData.stats.scoredAbove90} onChange={(e) => setLocalData({...localData, stats: {...localData.stats, scoredAbove90: parseInt(e.target.value)}})} />
            </div>
            <div className="glass" style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Highest Score Value</label>
              <input type="number" className="glass" style={{ width: '100%', padding: '10px' }} 
                value={localData.stats.highestScore} onChange={(e) => setLocalData({...localData, stats: {...localData.stats, highestScore: parseInt(e.target.value)}})} />
            </div>
          </motion.div>
        )}

        {/* TUTORS TAB */}
        {activeTab === 'tutors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button onClick={() => addTutor({ name: 'New Tutor', subject: '', experience: '', image: '' })} className="btn-outline" style={{ width: 'fit-content' }}>
              + Add Tutor
            </button>
            {localData.tutors.map(tutor => (
              <div key={tutor.id} className="glass" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" className="glass" style={{ padding: '10px' }} value={tutor.name} onChange={(e) => updateTutor(tutor.id, {...tutor, name: e.target.value})} placeholder="Tutor Name" />
                  <input type="text" className="glass" style={{ padding: '10px' }} value={tutor.subject} onChange={(e) => updateTutor(tutor.id, {...tutor, subject: e.target.value})} placeholder="Subject" />
                  <input type="text" className="glass" style={{ padding: '10px' }} value={tutor.experience} onChange={(e) => updateTutor(tutor.id, {...tutor, experience: e.target.value})} placeholder="Experience Details" />
                  <input type="text" className="glass" style={{ padding: '10px' }} value={tutor.image} onChange={(e) => updateTutor(tutor.id, {...tutor, image: e.target.value})} placeholder="Image URL (e.g. https://... or sukhmeet.jpg)" />
                </div>
                <button onClick={() => removeTutor(tutor.id)} className="btn-primary" style={{ background: '#ef4444', padding: '10px' }}>Remove</button>
              </div>
            ))}
          </motion.div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'messages' && <InquiriesTab />}

        {/* TEACHERS TAB */}
        {activeTab === 'teachers' && <TeachersTab />}

        {/* LIVE CLASSES TAB */}
        {activeTab === 'classes' && <LiveClassesTab />}

      </div>
    </div>
  );
};

/* ─── Contact Inquiries (Firestore) ─── */
const InquiriesTab = () => {
  const [inquiries, setInquiries] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchInquiries = async () => {
    setFetchLoading(true);
    setFetchError('');
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setFetchError('Failed to load inquiries. Check Firestore rules.');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleMarkRead = async (id, currentRead) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { read: !currentRead });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: !currentRead } : i));
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) { alert('Error: ' + err.message); }
  };

  const unread = inquiries.filter(i => !i.read).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {unread > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
              {unread} new
            </span>
          )}
        </div>
        <button onClick={fetchInquiries} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
          🔄 Refresh
        </button>
      </div>

      {fetchError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '14px', color: '#ef4444' }}>
          ⚠️ {fetchError}
        </div>
      )}

      {fetchLoading ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '60px' }}>No inquiries yet. They will appear here when someone submits the contact form.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {inquiries.map(inq => (
            <div key={inq.id} className="glass" style={{ padding: '20px', borderRadius: '14px', borderLeft: `4px solid ${inq.read ? 'rgba(0,0,0,0.08)' : '#2F80ED'}`, opacity: inq.read ? 0.75 : 1, transition: 'opacity 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{inq.name}</h4>
                    {!inq.read && <span style={{ background: 'rgba(47,128,237,0.15)', color: '#2F80ED', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(47,128,237,0.3)' }}>NEW</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                    {inq.phone && <a href={`tel:${inq.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>📞 {inq.phone}</a>}
                    {inq.email && <a href={`mailto:${inq.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>✉️ {inq.email}</a>}
                    {inq.createdAt?.toDate && <span>🕐 {inq.createdAt.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
                  </div>
                  <p style={{ lineHeight: '1.6', color: 'var(--text-dark)' }}>{inq.message}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => handleMarkRead(inq.id, inq.read)} title={inq.read ? 'Mark unread' : 'Mark read'} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: inq.read ? 'rgba(74,222,128,0.1)' : 'rgba(0,0,0,0.03)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: inq.read ? '#4ade80' : 'var(--text-light)' }}>
                    {inq.read ? '✓ Read' : 'Mark Read'}
                  </button>
                  <button onClick={() => handleDelete(inq.id)} style={{ padding: '7px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Authorized Teachers Manager ─── */
const TeachersTab = () => {
  const [teachers, setTeachers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchTeachers = async () => {
    setFetchLoading(true);
    try {
      const snap = await getDocs(collection(db, 'authorizedTeachers'));
      setTeachers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    setLoading(true);
    try {
      // Document ID = email so it's instantly lookup-able by loginWithGoogle
      await setDoc(doc(db, 'authorizedTeachers', email), {
        email,
        addedAt: new Date().toISOString(),
      });
      setNewEmail('');
      await fetchTeachers();
    } catch (err) {
      alert('Failed to add teacher: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email) => {
    if (!window.confirm(`Remove ${email} as authorized teacher?`)) return;
    try {
      await deleteDoc(doc(db, 'authorizedTeachers', email));
      await fetchTeachers();
    } catch (err) {
      alert('Failed to remove: ' + err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(47,128,237,0.05)', border: '1px solid rgba(47,128,237,0.15)' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          📋 <strong>How it works:</strong> Add a Gmail address here. When that person signs in with Google,
          they automatically get the <strong>Teacher</strong> role and can start live classes.
          No role can be self-selected — this list is the only gate.
        </p>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
          placeholder="teacher@gmail.com" required
          className="glass" style={{ flex: 1, padding: '12px 16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
        />
        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
          {loading ? 'Adding...' : '+ Add Teacher'}
        </button>
      </form>

      {fetchLoading ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>Loading...</p>
      ) : teachers.length === 0 ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>No authorized teachers yet. Add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {teachers.map(t => (
            <div key={t.id} className="glass" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(47,128,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>
                  {t.email[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Authorized Teacher</div>
                </div>
              </div>
              <button onClick={() => handleRemove(t.email)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Live Classes Manager ─── */
const LiveClassesTab = () => {
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
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'classes'), {
        title:         form.title.trim(),
        description:   form.description.trim(),
        scheduledTime: form.scheduledTime ? new Date(form.scheduledTime) : null,
        teacherId:     'admin-created',
        isLive:        false,
        createdAt:     serverTimestamp(),
      });
      setForm({ title: '', description: '', scheduledTime: '' });
      await fetchClasses();
    } catch (err) {
      alert('Failed to create class: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Delete this class?')) return;
    await deleteDoc(doc(db, 'classes', classId));
    await fetchClasses();
  };

  const copyLink = (classId) => {
    navigator.clipboard.writeText(`${window.location.origin}/live/${classId}`);
    setCopiedId(classId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Create form */}
      <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '20px', fontWeight: 700 }}>➕ Create New Class</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Class Title *</label>
            <input className="glass" style={inputStyle} placeholder="e.g. Physics — Chapter 5: Thermodynamics" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Description</label>
            <input className="glass" style={inputStyle} placeholder="Optional short description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Scheduled Date & Time</label>
            <input className="glass" style={inputStyle} type="datetime-local" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px', marginTop: '4px' }}>
            {loading ? 'Creating...' : '🚀 Create Class & Generate Link'}
          </button>
        </form>
      </div>

      {/* Class list */}
      <div>
        <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>📋 All Classes</h3>
        {fetchLoading ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>Loading...</p>
        ) : classes.length === 0 ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>No classes yet. Create one above.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classes.map(cls => (
              <div key={cls.id} className="glass" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{cls.title}</span>
                    {cls.isLive && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>LIVE</span>}
                  </div>
                  {cls.description && <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '4px' }}>{cls.description}</div>}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.04)', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
                    /live/{cls.id}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => copyLink(cls.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: copiedId === cls.id ? 'rgba(74,222,128,0.15)' : 'rgba(47,128,237,0.1)', border: `1px solid ${copiedId === cls.id ? 'rgba(74,222,128,0.4)' : 'rgba(47,128,237,0.3)'}`, borderRadius: '8px', color: copiedId === cls.id ? '#4ade80' : 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                    {copiedId === cls.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                  </button>
                  <button onClick={() => handleDelete(cls.id)} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
