import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserCircle2, Menu, X, Radio } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useAuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userProfile, loading } = useAuthContext();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const close = () => setIsMenuOpen(false);

  const handleLiveClassesClick = (e) => {
    e.preventDefault();
    close();
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar glass">
      <div className="container">
        <Link to="/" className="logo">
          <img className='logo-img' src={logoImg} alt="Learnwood Logo" style={{ width: '40px', height: '40px' }} />
          <span>Learnwood Coaching Classes</span>
        </Link>

        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={close}>Home</Link></li>
          <li><Link to="/contact" onClick={close}>Contact</Link></li>
          <li><Link to="https://www.youtube.com/@LearnwoodCoachingClasses" target="blank" onClick={close}>YouTube</Link></li>
          <li><Link to="/about" onClick={close}>About Us</Link></li>

          {/* ── Live Classes CTA ── */}
          <li>
            <a
              href="/dashboard"
              onClick={handleLiveClassesClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
                color: 'white',
                padding: '7px 16px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 0 12px rgba(47,128,237,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(86,204,242,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(47,128,237,0.4)'; }}
            >
              {/* Pulsing live dot */}
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'white', display: 'inline-block',
                animation: 'navLivePulse 1.5s ease-in-out infinite',
              }} />
              {currentUser ? '🎓 My Classes' : '📺 Join Live Class'}
            </a>
          </li>

          <li className="mobile-only">
            <Link to="/tutors" className="mobile-profile-link" onClick={close} style={{ marginBottom: '15px' }}>
              <UserCircle2 size={24} /> Our Tutors
            </Link>
            {!loading && currentUser && (
              <button 
                onClick={async () => {
                  const { signOut } = await import('firebase/auth');
                  const { auth } = await import('../../firebase/config');
                  await signOut(auth);
                  navigate('/login');
                  close();
                }}
                className="mobile-profile-link"
                style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, padding: 0, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                Sign Out
              </button>
            )}
          </li>
        </ul>

        {/* Desktop right-side section */}
        <div className="nav-actions desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/tutors" className="profile-link" title="Tutors" style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', textDecoration: 'none' }}>
            <UserCircle2 size={32} />
          </Link>

          {/* Show user name pill when logged in */}
          {!loading && currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(47,128,237,0.1)',
                border: '1px solid rgba(47,128,237,0.3)',
                color: 'var(--primary)',
                padding: '5px 12px', borderRadius: '20px',
                fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                {userProfile?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button 
                onClick={async () => {
                  const { signOut } = await import('firebase/auth');
                  const { auth } = await import('../../firebase/config');
                  await signOut(auth);
                  navigate('/login');
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#ef4444', fontSize: '0.85rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '4px', padding: '6px'
                }}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pulse keyframe */}
      <style>{`@keyframes navLivePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </nav>
  );
};

export default Navbar;

