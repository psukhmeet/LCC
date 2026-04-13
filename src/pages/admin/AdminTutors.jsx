import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Plus, Trash2, User, Book, Briefcase, Image as ImageIcon, Save, GraduationCap, Award, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminTutors = () => {
  const { data, updateTutor, addTutor, removeTutor, moveTutor } = useContext(DataContext);

  const handleGlobalSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'website'), {
        tutors: data.tutors,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('Tutors list saved successfully!');
    } catch (err) {
      alert('Failed to save to cloud: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Tutor Profiles</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Add, edit, or remove tutors from the public "Our Tutors" page.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleGlobalSave}
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
          >
            <Save size={18} /> Cloud Sync
          </button>
          <button 
            onClick={() => addTutor({ name: 'New Tutor', subject: '', education: '', experience: '', achievements: '', image: '' })}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            <Plus size={18} /> Add New Tutor
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {data.tutors.map((tutor, idx) => (
          <motion.div 
            key={tutor.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '24px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '20px', right: '60px', display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => moveTutor(tutor.id, 'top')}
                style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Move to Top"
              >
                <ChevronsUp size={16} />
              </button>
              <button 
                onClick={() => moveTutor(tutor.id, 'up')}
                style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Move Up"
              >
                <ChevronUp size={16} />
              </button>
              <button 
                onClick={() => moveTutor(tutor.id, 'down')}
                style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Move Down"
              >
                <ChevronDown size={16} />
              </button>
              <button 
                onClick={() => moveTutor(tutor.id, 'bottom')}
                style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Move to Bottom"
              >
                <ChevronsDown size={16} />
              </button>
            </div>

            <button 
              onClick={() => removeTutor(tutor.id)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
            >
              <Trash2 size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(47, 128, 237, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} />
              </div>
              <div>
                <input 
                  type="text" value={tutor.name} 
                  onChange={(e) => updateTutor(tutor.id, {...tutor, name: e.target.value})}
                  style={{ fontWeight: 700, fontSize: '1.1rem', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-dark)', width: '100%' }}
                  placeholder="Enter Name"
                />
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>ID: {tutor.id.slice(0, 8)}...</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px' }}>
                <Book size={16} color="#64748B" />
                <input 
                  type="text" value={tutor.subject} 
                  onChange={(e) => updateTutor(tutor.id, {...tutor, subject: e.target.value})}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                  placeholder="Subject (e.g. Physics)"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px' }}>
                <GraduationCap size={16} color="#64748B" />
                <input 
                  type="text" value={tutor.education} 
                  onChange={(e) => updateTutor(tutor.id, {...tutor, education: e.target.value})}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                  placeholder="Education (e.g. B.Tech NIT)"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px' }}>
                <Briefcase size={16} color="#64748B" />
                <input 
                  type="text" value={tutor.experience} 
                  onChange={(e) => updateTutor(tutor.id, {...tutor, experience: e.target.value})}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                  placeholder="Experience (e.g. 10+ Years)"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px' }}>
                <Award size={16} color="#64748B" />
                <input 
                  type="text" value={tutor.achievements} 
                  onChange={(e) => updateTutor(tutor.id, {...tutor, achievements: e.target.value})}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                  placeholder="Achievements (e.g. AIR-1)"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px' }}>
                <ImageIcon size={16} color="#64748B" />
                <input 
                  type="text" value={tutor.image} 
                  onChange={(e) => updateTutor(tutor.id, {...tutor, image: e.target.value})}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                  placeholder="Image filename (e.g. tutor.jpg)"
                />
              </div>
            </div>
          </motion.div>
        ))}
        {data.tutors.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '2px dashed #CBD5E1' }}>
             <User size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
             <p style={{ color: '#64748B', fontWeight: 500 }}>No tutors listed yet. Click "Add New Tutor" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTutors;
