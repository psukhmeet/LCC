import { MessageCircle } from 'lucide-react';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';

const WhatsAppCTA = () => {
  const { data } = useContext(DataContext);
  const phoneNumber = data.general.phone;
  const message = encodeURIComponent("Hello, I want to join Learnwood Coaching Classes.");
  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
          color: 'white',
          textDecoration: 'none',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default WhatsAppCTA;
