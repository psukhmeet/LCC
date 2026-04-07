import { MessageCircle } from 'lucide-react';

const WhatsAppCTA = () => {
  const phoneNumber = "+917814877280";
  const message = encodeURIComponent("Hi, How can i help  you.");
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
