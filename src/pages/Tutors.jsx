import { motion } from 'framer-motion';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const Tutors = () => {
  const { data } = useContext(DataContext);

  const getImageSrc = (imgSource) => {
    if (!imgSource) return '';
    if (imgSource.startsWith('http') || imgSource.startsWith('data:')) return imgSource;
    return new URL(`../assets/${imgSource}`, import.meta.url).href;
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="heading-xl">
          Our Expert <span className="text-gradient">Mentors</span>
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginTop: '10px' }}>
          Learn from the best educators with proven track records.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>
        {data.tutors.map((tutor) => (
          <motion.div
            key={tutor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="glass"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '350px'
            }}
          >
            <div style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
              <img
                src={getImageSrc(tutor.image)}
                alt={tutor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: 'top' }}
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
        ))}
      </div>
    </div>
  );
};

export default Tutors;