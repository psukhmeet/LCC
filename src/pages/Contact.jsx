import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, CheckCircle } from 'lucide-react';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Contact = () => {
  const { data } = useContext(DataContext);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await addDoc(collection(db, 'inquiries'), {
        name:      formData.name.trim(),
        phone:     formData.phone.trim(),
        email:     formData.email.trim(),
        message:   formData.message.trim(),
        createdAt: serverTimestamp(),
        read:      false,
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setSubmitError('Failed to send. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
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

          {/* Success banner */}
          {submitted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', color: '#4ade80' }}>
              <CheckCircle size={20} />
              <span>Message sent! We'll get back to you soon.</span>
            </div>
          )}

          {/* Error banner */}
          {submitError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#ef4444', fontSize: '0.9rem' }}>
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text" placeholder="Your Name" className="glass" required
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="tel" placeholder="Phone Number" className="glass" required
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="email" placeholder="Email Address (optional)" className="glass"
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <textarea
              placeholder="Your message or query..." className="glass" required
              style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '1rem', outline: 'none', height: '150px', resize: 'vertical' }}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? 'Sending...' : <> Send Message <Send size={18} /></>}
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'center' }}
        >
          <div className="glass" style={{ padding: '40px', borderRadius: '20px' }}>
            <h3 style={{ marginBottom: '30px', fontSize: '1.8rem' }}>Contact Information</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', color: 'var(--text-light)' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '50%', flexShrink: 0 }}><Phone size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1.1rem' }}>Phone Numbers</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(data.general.phoneNumbers || []).map((p, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '40px' }}>
                        <span style={{ fontWeight: 600 }}>{p.country}:</span>
                        <a href={`tel:${p.number.replace(/\s+/g, '')}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>{p.number}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-light)' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '50%', flexShrink: 0 }}><Mail size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px', fontSize: '1.1rem' }}>Email Address</div>
                  <a href={`mailto:${data.general.email}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>{data.general.email}</a>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default Contact;
