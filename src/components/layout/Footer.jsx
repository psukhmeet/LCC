import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';
import WhatsAppCTA from '../ui/WhatsAppCTA';

const Footer = () => {
  return (
    <footer style={{ background: '#1E293B', color: 'white', padding: '60px 0 30px', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 className="heading-lg" style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 16px 0' }}>Learnwood Coaching Classes</h3>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '15px' }}>
            <a href="https://www.youtube.com/@LearnwoodCoachingClasses" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
              <Youtube size={24} />
            </a>
            <a href="https://wa.me/+917814877280" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
              <MessageCircle size={24} />
            </a>
            <a href="https://www.instagram.com/learnwoodcoachingclasses" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
              <Instagram size={24} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61580787894184" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
              <Facebook size={24} />
            </a>
          </div>
          <p style={{ color: '#94A3B8', lineHeight: '1.6' }}>
            Empowering students with expert PCM coaching for Class 11th and 12th. Build your future with us.
          </p>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', color: 'white', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            <li><Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Home</Link></li>
            <li><Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>About Us</Link></li>
            <li><Link to="/tutors" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Our Tutors</Link></li>
            <li><Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Contact</Link></li>
            <li><Link to="https://www.youtube.com/@LearnwoodCoachingClasses" target="blank" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>YouTube</Link></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', color: 'white', fontFamily: 'var(--font-heading)' }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            <li><Link to="/privacy-policy" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #334155', textAlign: 'center', color: '#64748B' }}>
        <p>&copy; {new Date().getFullYear()} Learnwood Coaching Classes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
