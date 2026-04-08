import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === import.meta.env.VITE_ADMIN_PASSKEY) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Passkey');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', position: 'relative' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', textAlign: 'center' }}
      >
        <div style={{ background: 'rgba(47, 128, 237, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 20px' }}>
          <Lock size={30} />
        </div>
        <h2 className="heading-lg" style={{ fontSize: '2rem', marginBottom: '10px' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Enter your access passkey.</p>
        
        {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="password"
            placeholder="Passkey"
            className="glass"
            style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            Login <LogIn size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
