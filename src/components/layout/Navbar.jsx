import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, UserCircle2, Menu, X } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link to="https://www.youtube.com/@LearnwoodCoachingClasses" target="blank" onClick={() => setIsMenuOpen(false)}>YouTube</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          <li className="mobile-only">
            <Link to="/tutors" className="mobile-profile-link" onClick={() => setIsMenuOpen(false)}>
              <UserCircle2 size={24} /> Our Tutors
            </Link>
          </li>
        </ul>

        <div className="nav-actions desktop-only">
          <Link to="/tutors" className="profile-link" title="Tutors" style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', textDecoration: 'none' }}>
            <UserCircle2 size={32} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
