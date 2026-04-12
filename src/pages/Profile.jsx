import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Profile = () => {
  const { currentUser, userProfile, loading } = useAuthContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2 className="heading-lg">Please Log In</h2>
        <p>You need to be logged in to view your profile.</p>
        <button onClick={() => navigate('/login')} className="btn-primary" style={{ marginTop: '20px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const role = userProfile?.role || 'student';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '40px', 
          borderRadius: '24px',
          textAlign: 'center'
        }}
      >
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'rgba(47, 128, 237, 0.1)', 
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          border: '4px solid rgba(47, 128, 237, 0.05)'
        }}>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <User size={48} />
          )}
        </div>

        <h1 className="heading-lg" style={{ marginBottom: '8px' }}>{userProfile?.name || currentUser.displayName || 'User'}</h1>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: role === 'teacher' ? 'rgba(47, 128, 237, 0.1)' : 'rgba(74, 222, 128, 0.1)',
          color: role === 'teacher' ? 'var(--primary)' : '#4ade80',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '30px',
          border: `1px solid ${role === 'teacher' ? 'rgba(47, 128, 237, 0.2)' : 'rgba(74, 222, 128, 0.2)'}`
        }}>
          <Shield size={14} /> {roleLabel}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '40px' }}>
          <div className="glass" style={{ padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: 'var(--primary)' }}><Mail size={20} /></div>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Email Address</p>
              <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>{currentUser.email}</p>
            </div>
          </div>

          <div className="glass" style={{ padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: 'var(--primary)' }}><Clock size={20} /></div>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Account Status</p>
              <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>Active</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary" 
            style={{ flex: 1 }}
          >
            <BookOpen size={18} /> {role === 'teacher' ? 'Instructor Panel' : 'My Dashboard'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="btn-outline" 
            style={{ 
              borderColor: '#ef4444', 
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px'
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
