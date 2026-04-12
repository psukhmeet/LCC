import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 className="heading-lg" style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 16px 0' }}>
            <span className="text-gradient">Learnwood Coaching Classes</span>
          </h3>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '15px' }}>
            <a href="https://www.youtube.com/@LearnwoodCoachingClasses" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <Youtube size={24} />
            </a>
            <a href="https://wa.me/917814877280" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <MessageCircle size={24} />
            </a>
            <a href="https://www.instagram.com/learnwoodcoachingclasses" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <Instagram size={24} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61580787894184" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <Facebook size={24} />
            </a>
          </div>
          <p style={{ color: '#94A3B8', lineHeight: '1.6' }}>
            Building logic, Understanding and Confidence. Complete coaching for all subjects, all streams.
          </p>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', color: 'white', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/tutors" className="footer-link">Our Tutors</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            <li><a href="https://www.youtube.com/@LearnwoodCoachingClasses" target="_blank" rel="noopener noreferrer" className="footer-link">YouTube</a></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', color: 'white', fontFamily: 'var(--font-heading)' }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="footer-link">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Learnwood Coaching Classes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
