import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import { Save, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminSettings = () => {
  const { data, updateCategory } = useContext(DataContext);
  const [localData, setLocalData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateCategory('general', localData.general);
      updateCategory('stats', localData.stats);
      
      await setDoc(doc(db, 'settings', 'website'), {
        general: localData.general,
        stats: localData.stats,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert('Settings updated successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addPhone = () => {
    const newPhones = [...(localData.general.phoneNumbers || []), { country: '', number: '' }];
    setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
  };

  const removePhone = (idx) => {
    const newPhones = localData.general.phoneNumbers.filter((_, i) => i !== idx);
    setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
  };

  const updatePhone = (idx, field, value) => {
    const newPhones = [...localData.general.phoneNumbers];
    newPhones[idx][field] = value;
    setLocalData({...localData, general: {...localData.general, phoneNumbers: newPhones}});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Site Configuration</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Manage your website's primary content and achievements.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Hero Section Card */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Hero Section</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Main Heading</label>
              <input 
                type="text" className="glass" style={{ width: '100%', padding: '12px' }} 
                value={localData.general.heroTitle} 
                onChange={(e) => setLocalData({...localData, general: {...localData.general, heroTitle: e.target.value}})} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Sub-heading Text</label>
              <textarea 
                className="glass" style={{ width: '100%', padding: '12px', height: '100px', resize: 'none' }} 
                value={localData.general.heroSubtext} 
                onChange={(e) => setLocalData({...localData, general: {...localData.general, heroSubtext: e.target.value}})}
              />
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Contact Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600 }}>Phone Numbers</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(localData.general.phoneNumbers || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="glass" style={{ width: '100px', padding: '10px', fontSize: '0.85rem' }} 
                      placeholder="India" value={p.country} onChange={(e) => updatePhone(idx, 'country', e.target.value)} />
                    <input type="text" className="glass" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }} 
                      placeholder="+91..." value={p.number} onChange={(e) => updatePhone(idx, 'number', e.target.value)} />
                    <button onClick={() => removePhone(idx)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={addPhone} className="btn-outline" style={{ padding: '8px', fontSize: '0.8rem', borderStyle: 'dashed' }}>
                  <Plus size={14} /> Add Number
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>General Email</label>
              <input 
                type="email" className="glass" style={{ width: '100%', padding: '12px' }} 
                value={localData.general.email} 
                onChange={(e) => setLocalData({...localData, general: {...localData.general, email: e.target.value}})} 
              />
            </div>
          </div>
        </div>

        {/* Global Statistics Card */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Achievement Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Students Mentored</label>
              <input type="number" className="glass" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 700 }} 
                value={localData.stats.studentsMentored} onChange={(e) => setLocalData({...localData, stats: {...localData.stats, studentsMentored: parseInt(e.target.value)}})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Scored Above 90%</label>
              <input type="number" className="glass" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 700 }} 
                value={localData.stats.scoredAbove90} onChange={(e) => setLocalData({...localData, stats: {...localData.stats, scoredAbove90: parseInt(e.target.value)}})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Highest Percentage</label>
              <input type="number" className="glass" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: 700 }} 
                value={localData.stats.highestScore} onChange={(e) => setLocalData({...localData, stats: {...localData.stats, highestScore: parseInt(e.target.value)}})} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
