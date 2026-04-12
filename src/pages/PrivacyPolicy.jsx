import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '900px', minHeight: '60vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading-lg" style={{ textAlign: 'center', marginBottom: '40px' }}>Privacy Policy</h1>
        
        <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: 'var(--text-light)' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>1. Introduction</h2>
            <p>
              Welcome to Learnwood Coaching Classes. We value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or enroll in our courses.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>2. Information We Collect</h2>
            <p>We may collect personal information such as:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Full name and parent/guardian details.</li>
              <li>Contact information (email address and phone number).</li>
              <li>Academic details (current school, grade, and performance).</li>
              <li>Payment information (for course enrollment and tuition fees).</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>3. How We Use Your Information</h2>
            <p>Your data is used solely for educational and administrative purposes, including:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Processing enrollments and managing student records.</li>
              <li>Communicating class schedules, results, and academic updates.</li>
              <li>Improving our teaching methodology and website experience.</li>
              <li>Responding to inquiries and providing academic support.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>4. Data Protection and Security</h2>
            <p>
              We prioritize the security of your personal data. We implement industry-standard physical, electronic, and managerial procedures to prevent unauthorized access, maintain data accuracy, and ensure the correct use of information.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>5. Third-Party Sharing</h2>
            <p>
              Learnwood Coaching Classes does not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>6. Contact Information</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at:
              <br />
              <strong>Phone:</strong> +91 78148 77280
              <br />
              <strong>Address:</strong> Learnwood Coaching Classes, India.
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

export default PrivacyPolicy;
