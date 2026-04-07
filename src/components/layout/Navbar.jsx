import { Link } from 'react-router-dom';
import { BookOpen, UserCircle2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar glass">
      <div className="container">
        <Link to="/" className="logo">
          <image className='logo' src="./assets/logo.png"></image>
          Learnwood Coaching Classes
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="https://www.youtube.com/@LearnwoodCoachingClasses" target="blank">YouTube</Link></li>
          <li><Link to="/contact">About Us</Link></li>
        </ul>
        <div className="nav-actions">
          <Link to="/tutors" className="profile-link" title="Tutors" style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', textDecoration: 'none' }}>
            <UserCircle2 size={32} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
