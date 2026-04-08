import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import ParticleBackground from '../components/ui/ParticleBackground';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';const AnimatedCounter = ({ end, duration = 2, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const TiltCard = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass ${className}`}
      style={{ padding: '30px', borderRadius: '20px', perspective: 1000, display: 'flex', flexDirection: 'column', gap: '15px' }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const { data } = useContext(DataContext);

  return (
    <div style={{ position: 'relative' }}>
      <ParticleBackground />

      {/* 1. HERO SECTION */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="heading-xl" style={{ marginBottom: '20px' }}>
              {data.general.heroTitle}
            </h1>
            <p className="text-visible" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
              {data.general.heroSubtext}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary">
                Join Now <ArrowRight size={18} />
              </Link>
              <Link to="/tutors" className="btn-outline">
                Explore Tutors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COURSES SECTION */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(180deg, transparent, rgba(248, 250, 252, 0.8))' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="heading-lg">Our Focus Subjects</h2>
            <p style={{ color: 'var(--text-light)' }}>Specialized coaching in core science subjects</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <TiltCard>
              <div style={{ background: 'rgba(47, 128, 237, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Award size={30} />
              </div>
              <h3 style={{ fontSize: '1.5rem' }}>Physics</h3>
              <p style={{ color: 'var(--text-light)' }}>Master the fundamental laws of nature with experimental and conceptual clarity.</p>
            </TiltCard>
            <TiltCard>
              <div style={{ background: 'rgba(86, 204, 242, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <BookOpen size={30} />
              </div>
              <h3 style={{ fontSize: '1.5rem' }}>Chemistry</h3>
              <p style={{ color: 'var(--text-light)' }}>From organic reactions to physical principles, simplified for your success.</p>
            </TiltCard>
            <TiltCard>
              <div style={{ background: 'rgba(47, 128, 237, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Award size={30} />
              </div>
              <h3 style={{ fontSize: '1.5rem' }}>Mathematics</h3>
              <p style={{ color: 'var(--text-light)' }}>Develop strong logical reasoning and problem-solving skills for competitive exams.</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. ACHIEVEMENTS / RESULTS */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="heading-lg text-gradient">Our Results Speak</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
            <div>
              <div className="heading-xl" style={{ color: 'var(--primary)' }}>
                <AnimatedCounter end={data.stats.studentsMentored} suffix={data.stats.studentsMentoredSuffix} />
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-dark)' }}>Students Mentored</p>
            </div>
            <div>
              <div className="heading-xl" style={{ color: 'var(--secondary)' }}>
                <AnimatedCounter end={data.stats.scoredAbove90} suffix={data.stats.scoredAbove90Suffix} />
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-dark)' }}>Scored Above 90%</p>
            </div>
            <div>
              <div className="heading-xl" style={{ color: 'var(--primary)' }}>
                <AnimatedCounter end={data.stats.highestScore} suffix={data.stats.highestScoreSuffix} />
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-dark)' }}>Highest Board Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMOTIONAL / FINAL CTA */}
      <section style={{ padding: '120px 0', background: '#0f172a', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '120%', height: '200%', background: 'radial-gradient(circle, rgba(47,128,237,0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="heading-lg"
            style={{ color: 'white', marginBottom: '30px' }}
          >
            "Every topper was once a beginner"
          </motion.h2>
          <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '40px' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '20px' }}>Start Your Journey Today</h3>
            <p style={{ marginBottom: '30px', color: '#94a3b8' }}>Join our community of high achievers and take control of your academic future.</p>
            <Link to="/contact" className="btn-primary" style={{ fontSize: '1.1rem', padding: '15px 35px' }}>
              Enroll Now <CheckCircle2 size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar CTA */}
      <div className="desktop-only" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', zIndex: 9998, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontWeight: '600' }}>Enroll Now | Limited Seats</span>
        <button onClick={() => window.open(`https://wa.me/${data.general.phone}?text=Hi, How can i help  you.`, '_blank')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>WhatsApp Us</button>
      </div>

    </div>
  );
};

export default Home;
