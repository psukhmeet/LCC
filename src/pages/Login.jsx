import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    padding: '24px',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  logo: { textAlign: 'center', marginBottom: '32px' },
  logoTitle: {
    fontSize: '1.5rem', fontWeight: 800,
    background: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  logoSub: { color: '#64748b', fontSize: '0.875rem', marginTop: '4px' },
  tabs: {
    display: 'flex', background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px', padding: '4px', marginBottom: '28px', gap: '4px',
  },
  tab: (active) => ({
    flex: 1, padding: '9px', border: 'none', borderRadius: '9px',
    cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #2F80ED, #56CCF2)' : 'transparent',
    color: active ? 'white' : '#94a3b8',
  }),
  label: {
    display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
    marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
    padding: '12px 16px', color: 'white', fontSize: '1rem', outline: 'none',
    marginBottom: '16px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  },
  select: {
    width: '100%', background: 'rgba(15,23,42,0.9)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
    padding: '12px 16px', color: 'white', fontSize: '1rem', outline: 'none',
    marginBottom: '16px', boxSizing: 'border-box',
  },
  btnPrimary: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
    border: 'none', borderRadius: '12px', color: 'white',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.2s', letterSpacing: '0.02em',
  },
  error: {
    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: '10px', padding: '12px 16px', color: '#fca5a5',
    fontSize: '0.875rem', marginBottom: '16px',
  },
  toggle: { textAlign: 'center', marginTop: '18px', color: '#64748b', fontSize: '0.875rem' },
  toggleBtn: {
    background: 'none', border: 'none', color: '#56CCF2', cursor: 'pointer',
    fontSize: '0.875rem', fontWeight: 600, padding: '0 4px',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0',
  },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' },
  dividerText: { color: '#475569', fontSize: '0.78rem', whiteSpace: 'nowrap' },
  googleBtn: {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', cursor: 'pointer', color: 'white',
    fontWeight: 600, fontSize: '0.95rem', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s',
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, loginWithGoogle, error, loading, clearError } = useAuth();

  const [mode, setMode]       = useState('login');  // 'login' | 'register'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');

  const switchMode = (m) => { setMode(m); clearError(); setEmail(''); setPassword(''); setName(''); };

  // ── Email submit ──
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearError();
    let user;
    if (mode === 'register') {
      if (!name.trim()) return;
      user = await registerWithEmail(email, password, name);
    } else {
      user = await loginWithEmail(email, password);
    }
    if (user) navigate('/dashboard');
  };

  // ── Google ──
  const handleGoogle = async () => {
    clearError();
    const user = await loginWithGoogle();
    if (user) navigate('/dashboard');
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoTitle}>🎓 Learnwood Coaching</div>
          <div style={S.logoSub}>Sign in to access your live classes</div>
        </div>

        {/* Mode tabs: Login / Register */}
        <div style={S.tabs}>
          <button style={S.tab(mode === 'login')}    onClick={() => switchMode('login')}>🔐 Sign In</button>
          <button style={S.tab(mode === 'register')} onClick={() => switchMode('register')}>🚀 Register</button>
        </div>

        {/* Error banner */}
        {error && <div style={S.error}>⚠️ {error}</div>}

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSubmit}>
          {mode === 'register' && (
            <>
              <label style={S.label}>Full Name</label>
              <input
                style={S.input} type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)} required
              />
            </>
          )}
          <label style={S.label}>Email Address</label>
          <input
            style={S.input} type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required
          />
          <label style={S.label}>Password</label>
          <input
            style={S.input} type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} required
          />
          <button
            type="submit" style={S.btnPrimary} disabled={loading}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {loading ? '⏳ Please wait...' : mode === 'register' ? '🚀 Create Account' : '🔐 Sign In'}
          </button>
        </form>

        {/* Switch between login / register */}
        <div style={S.toggle}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button style={S.toggleBtn} onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? ' Register' : ' Sign In'}
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or continue with</span>
          <div style={S.dividerLine} />
        </div>

        {/* ── Google button ── */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{ ...S.googleBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >
          {/* Google colour icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#334155', marginTop: '12px' }}>
          🔒 Teachers are recognised automatically by their authorised Gmail.
        </p>
      </div>
    </div>
  );
};

export default Login;
