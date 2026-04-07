import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions = () => {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '900px', minHeight: '60vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading-lg" style={{ textAlign: 'center', marginBottom: '40px' }}>Terms & Conditions</h1>
        
        <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: 'var(--text-light)' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>1. Use of Website</h2>
            <p>
              By accessing this website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>2. Course Enrollment and Registration</h2>
            <p>
              Registration for courses at Learnwood Coaching Classes is subject to verification. The coaching classes reserves the right to refuse enrollment based on internal criteria. Students are required to provide accurate and complete personal details during registration.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>3. Intellectual Property Rights</h2>
            <p>
              All course materials, including notes, lectures, digital content, and proprietary teaching methods, are the intellectual property of Learnwood Coaching Classes. No student or third party is permitted to copy, distribute, or reproduce these materials for commercial or non-commercial use without written consent.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>4. Student Conduct and Responsibilities</h2>
            <p>
              Students are expected to maintain a high standard of discipline and respect within the coaching environment. Any form of harassment, academic dishonesty, or disruptive behavior will not be tolerated and may lead to immediate termination of enrollment without refund.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>5. Limitation of Liability</h2>
            <p>
              Learnwood Coaching Classes is not responsible for any direct or indirect damages resulting from the use or inability to use this website or our coaching services. We provide academic guidance and support, and the results of competitive exams are subject to individual performance.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>6. Termination of Service</h2>
            <p>
              Learnwood Coaching Classes reserves the right to terminate access to the website or enrollment for any user or student who violates these Terms & Conditions.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>7. Amendments</h2>
            <p>
              Learnwood Coaching Classes may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <p style={{ marginTop: '40px', fontSize: '0.9rem', textAlign: 'center' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsConditions;
