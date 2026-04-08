import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { LogOut, Save, Settings, Users, BarChart, MessageSquare, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { data, updateData, updateTutor, addTutor, removeTutor, removeMessage, resetToDefault } = useContext(DataContext);
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

  const handleSave = () => {
    // Only saving general and stats directly here; tutors are handled separately for UX
    Object.keys(localData.general).forEach(key => {
      updateData('general', key, localData.general[key]);
    });
    Object.keys(localData.stats).forEach(key => {
      updateData('stats', key, localData.stats[key]);
    });
    alert('Changes saved temporarily to local storage. They will persist in your browser.');
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
        <SidebarButton id="general" icon={Settings} label="General Settings" />
        <SidebarButton id="stats" icon={BarChart} label="Statistics" />
        <SidebarButton id="tutors" icon={Users} label="Tutors" />
        <SidebarButton id="messages" icon={MessageSquare} label="Inquiries" />
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
            {activeTab === 'general' && 'General Settings'}
            {activeTab === 'stats' && 'Statistics Settings'}
            {activeTab === 'tutors' && 'Manage Tutors'}
            {activeTab === 'messages' && 'Contact Inquiries'}
          </h2>
          {activeTab !== 'tutors' && activeTab !== 'messages' && (
            <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
              <Save size={18} /> Save Changes
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>WhatsApp Phone</label>
                <input type="text" className="glass" style={{ width: '100%', padding: '15px' }} 
                  value={localData.general.phone} onChange={(e) => setLocalData({...localData, general: {...localData.general, phone: e.target.value}})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Contact Email</label>
                <input type="email" className="glass" style={{ width: '100%', padding: '15px' }} 
                  value={localData.general.email} onChange={(e) => setLocalData({...localData, general: {...localData.general, email: e.target.value}})} />
              </div>
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

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(!localData.messages || localData.messages.length === 0) ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>No messages found.</p>
            ) : (
              localData.messages.map(msg => (
                <div key={msg.id} className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{msg.name}</h4>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        {new Date(msg.date).toLocaleString()} • <a href={`tel:${msg.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{msg.phone}</a>
                      </p>
                    </div>
                    <button onClick={() => removeMessage(msg.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p style={{ lineHeight: '1.6', color: 'var(--text-dark)' }}>{msg.message}</p>
                </div>
              ))
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
