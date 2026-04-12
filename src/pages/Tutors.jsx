import { motion } from 'framer-motion';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { GraduationCap, Award, Briefcase, Book } from 'lucide-react';

const Tutors = () => {
  const { data } = useContext(DataContext);

  const getImageSrc = (imgSource) => {
    if (!imgSource) return '';
    if (imgSource.startsWith('http') || imgSource.startsWith('data:')) return imgSource;
    return new URL(`../assets/${imgSource}`, import.meta.url).href;
  };

  const InfoRow = ({ icon: Icon, text, color }) => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px', textAlign: 'left' }}>
      <div style={{ padding: '6px', background: `${color}15`, borderRadius: '8px', color: color, display: 'flex' }}>
        <Icon size={16} />
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.4, fontWeight: 500 }}>
        {text}
      </p>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="heading-xl">
          Our Expert <span className="text-gradient">Mentors</span>
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginTop: '10px' }}>
          Learn from the best educators with proven track records and elite credentials.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px' }}>
        {data.tutors.map((tutor) => (
          <motion.div
            key={tutor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '380px',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }}
          >
            {/* Image Section */}
            <div style={{ width: '100%', height: '320px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={getImageSrc(tutor.image)}
                alt={tutor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: 'top' }}
              />
              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', height: '60px' }}></div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-dark)' }}>
                {tutor.name}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tutor.subject && <InfoRow icon={Book} text={tutor.subject} color="var(--primary)" />}
                {tutor.education && <InfoRow icon={GraduationCap} text={tutor.education} color="#8B5CF6" />}
                {tutor.experience && <InfoRow icon={Briefcase} text={tutor.experience} color="#10B981" />}
                {tutor.achievements && <InfoRow icon={Award} text={tutor.achievements} color="#F59E0B" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tutors;