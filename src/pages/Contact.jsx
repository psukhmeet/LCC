import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us. We will get back to you shortly.');
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="heading-xl">Get in <span className="text-gradient">Touch</span></h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginTop: '10px' }}>We are here to answer your questions and guide you.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass"
          style={{ padding: '40px', borderRadius: '20px' }}
        >
          <h2 style={{ marginBottom: '30px', fontSize: '1.8rem' }}>Send a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="text"
              placeholder="Your Name"
              className="glass"
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="glass"
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <textarea
              placeholder="Message"
              className="glass"
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none', height: '150px', resize: 'vertical' }}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            ></textarea>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Send Message <Send size={18} />
            </button>
          </form>
        </motion.div>

        {/* Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
        >
          <div className="glass" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Contact Information</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-light)' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '50%' }}><MapPin size={20} /></div>
                <span>Ludhiana</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-light)' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '50%' }}><Phone size={20} /></div>
                <span>+91 78148 77280</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-light)' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '50%' }}><Mail size={20} /></div>
                <span>learnwoodcoachingclasses@gmail.com</span>
              </li>
            </ul>
          </div>

          <div style={{ width: '100%', height: '250px', borderRadius: '20px', overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17264.45970834544!2d75.9505250055313!3d30.83899459283517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39107614872ab7b5%3A0xaf8165cce2800588!2sSahnewal%2C%20Punjab!5e0!3m2!1sen!2sin!4v1775560493885!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
