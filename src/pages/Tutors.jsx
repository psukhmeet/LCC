import { motion } from 'framer-motion';
import tutorImg from "../assets/sukhmeet.jpeg";

const Tutors = () => {
  const tutor = {
    name: "Mr. Sukhmeet Singh",
    subject: "Mathematics",
    experience: "NIT Jamshedpur | AIR-377 NIMCET'25 | 5+ Years Experience",
    image: tutorImg
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="heading-xl">
          Our Expert <span className="text-gradient">Mentor</span>
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginTop: '10px' }}>
          Learn from the best educator with proven track record.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          className="glass"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            width: '320px'
          }}
        >
          <div style={{ height: '250px', width: '100%', overflow: 'hidden' }}>
            <img
              src={tutor.image}
              alt={tutor.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ padding: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
              {tutor.name}
            </h3>
            <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '10px' }}>
              {tutor.subject}
            </p>
            <p style={{ color: 'var(--text-light)' }}>
              {tutor.experience}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tutors;