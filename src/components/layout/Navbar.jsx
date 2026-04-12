import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserCircle2, Menu, X } from 'lucide-react';
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
      <div className="container nav-wrapper">
        <Link to="/" className="logo">
          <img className='logo-img' src={logoImg} alt="Learnwood Logo" />
          <span className="brand-text">Learnwood <span className="brand-full">Coaching Classes</span></span>
        </Link>

        {/* --- Navigation Links --- */}
        <div className={`nav-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
            <li><NavLink to="/contact" onClick={close}>Contact</NavLink></li>
            <li><a href="https://www.youtube.com/@LearnwoodCoachingClasses" target="_blank" rel="noopener noreferrer" onClick={close}>YouTube</a></li>
            <li><NavLink to="/tutors" onClick={close}>Our Tutors</NavLink></li>
            <li><NavLink to="/about" onClick={close}>About Us</NavLink></li>

            {/* --- Profile Link for Mobile --- */}
            <li className="mobile-only">
              <Link to="/profile" className="mobile-profile-link" onClick={close}>
                <UserCircle2 size={24} /> My Profile
              </Link>
            </li>

            {/* Only show Dashboard CTA if not on it */}
            <li className="mobile-only cta-mobile">
              <a href="/dashboard" onClick={handleLiveClassesClick} className="nav-live-link">
                <span className="nav-live-dot" />
                {currentUser ? '🎓 Dashboard' : '📺 Join Live'}
              </a>
            </li>

            {!loading && currentUser && (
              <li className="mobile-only">
                <button
                  onClick={async () => {
                    const { signOut } = await import('firebase/auth');
                    const { auth } = await import('../../firebase/config');
                    await signOut(auth);
                    navigate('/login');
                    close();
                  }}
                  className="mobile-profile-link logout-btn"
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* --- Desktop & Persistent Actions --- */}
        <div className="nav-right">
          {/* Dashboard CTA (Desktop) */}
          <div className="desktop-only">
            <a href="/dashboard" onClick={handleLiveClassesClick} className="nav-live-link">
              <span className="nav-live-dot" />
              {currentUser ? 'Live Classes' : 'Join Live'}
            </a>
          </div>

          <div className="nav-actions">
            {!loading && currentUser ? (
              <div className="user-pill-container">
                <Link to="/profile" className="user-pill" title="View Profile">
                  <div className="status-dot" />
                  <span className="user-name">{userProfile?.name?.split(' ')[0] || 'User'}</span>
                </Link>
              </div>
            ) : (
              <Link to="/profile" className="profile-link" title="My Profile">
                <UserCircle2 size={28} />
              </Link>
            )}
          </div>

          <button
            className="mobile-toggle"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
