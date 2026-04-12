import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserCircle2, Menu, X, Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';
import { useAuthContext } from '../../context/AuthContext';
import { DataContext } from '../../context/DataContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const { data } = useContext(DataContext);
  const { currentUser, userProfile, loading } = useAuthContext();
  const navigate = useNavigate();

  const [lastSeen, setLastSeen] = useState(() => localStorage.getItem('last_seen_note') || '');

  const unreadCount = (data.notifications || []).filter(n => n.id > lastSeen).length;

  const handleToggleNotes = () => {
    setShowNotes(!showNotes);
    if (!showNotes && data.notifications?.length > 0) {
      const latestId = data.notifications[0].id;
      setLastSeen(latestId);
      localStorage.setItem('last_seen_note', latestId);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const close = () => {
    setIsMenuOpen(false);
    setShowNotes(false);
  };

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
            <li><a href="https://www.youtube.com/@LearnwoodCoachingClasses" target="_blank" rel="noopener noreferrer" onClick={close}>YouTube</a></li>
            <li><NavLink to="/tutors" onClick={close}>Our Tutors</NavLink></li>
            <li><NavLink to="/contact" onClick={close}>Contact Us</NavLink></li>
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
            {/* Notification Bell */}
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <button 
                className="nav-action-btn"
                onClick={handleToggleNotes}
                title="Notifications"
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', display: 'flex' }}
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="notification-badge" />
                )}
              </button>

              <AnimatePresence>
                {showNotes && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="notification-dropdown glass"
                  >
                    <div className="notes-header">
                      <span>Announcements</span>
                      <button 
                        onClick={() => setShowNotes(false)}
                        style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="notes-list">
                      {(data.notifications || []).length > 0 ? (
                        data.notifications.slice(0, 5).map(note => (
                          <div key={note.id} className="note-card">
                            <div className={`note-icon ${note.type}`}>
                              {note.type === 'alert' ? <AlertTriangle size={14} /> : note.type === 'success' ? <CheckCircle size={14} /> : <Info size={14} />}
                            </div>
                            <div className="note-body">
                              <p className="note-title">{note.title}</p>
                              <p className="note-msg">{note.message}</p>
                              <span className="note-time">{note.createdAt?.toDate ? note.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="notes-empty">
                          <Bell size={30} opacity={0.2} />
                          <p>No new updates</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
