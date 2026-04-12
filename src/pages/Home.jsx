import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users, Star, ArrowRight, CheckCircle2, Calculator, Activity, Book, Briefcase, Languages, Globe, Zap, Target, ShieldCheck } from 'lucide-react';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const AnimatedCounter = ({ end, duration = 2, suffix = "+" }) => {
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

const SubjectCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
    className="glass-card-minimal"
    style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}
  >
    <div className="benefit-icon" style={{ background: `${color}15`, color: color }}>
      <Icon size={24} />
    </div>
    <div>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.6' }}>{desc}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const { data } = useContext(DataContext);

  const subjects = [
    { icon: Activity, title: "Physics", desc: "Understand concepts with real-world applications and problem solving.", color: "#6366F1" },
    { icon: BookOpen, title: "Chemistry", desc: "Master reactions, formulas, and concepts with easy explanations.", color: "#22D3EE" },
    { icon: Calculator, title: "Mathematics", desc: "Boost logical thinking and speed for competitive exams.", color: "#6366F1" },
    { icon: Target, title: "Biology", desc: "Explore life sciences with diagrams and concept clarity.", color: "#22D3EE" },
    { icon: Book, title: "English", desc: "Improve grammar, vocabulary, and communication skills.", color: "#6366F1" },
    { icon: Briefcase, title: "Commerce", desc: "Learn business, accounts, and economics with clarity.", color: "#22D3EE" },
    { icon: Languages, title: "Hindi", desc: "Strengthen language skills with literature and grammar.", color: "#6366F1" },
    { icon: Globe, title: "Punjabi", desc: "Learn Punjabi language with culture and expression.", color: "#22D3EE" }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION (RESTORED WITH LOGO BG) */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        paddingTop: '100px', 
        paddingBottom: '80px', 
        position: 'relative',
        backgroundColor: 'rgba(206, 211, 218, 0.95)',

      }}>
        <div className="mesh-blob" style={{ top: '-100px', left: '10%', width: '400px', height: '400px', opacity: 0.03 }}></div>
        <div className="mesh-blob" style={{ bottom: '0', right: '10%', width: '500px', height: '500px', opacity: 0.05 }}></div>
        
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            
            <h1 className="heading-xl" style={{ marginBottom: '24px', maxWidth: '1000px', margin: '0 auto 24px' }}>
              Build Your Future with <span className="text-gradient">Learnwood</span>
            </h1>
            
            <p style={{ fontSize: '1.4rem', color: 'var(--text-light)', maxWidth: '750px', margin: '0 auto 48px', lineHeight: '1.6', fontWeight: '500' }}>
              All Subjects. All Streams. One Journey - from basics to success.
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary" style={{ padding: '18px 45px', fontSize: '1.1rem' }}>
                Join Now <ArrowRight size={20} />
              </Link>
              <Link to="/tutors" className="btn-outline" style={{ padding: '18px 45px', fontSize: '1.1rem' }}>
                Explore Tutors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COURSES SECTION (RESTORED ALL 8) */}
      <section style={{ padding: '120px 0', background: 'white', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="section-label">Our Curriculum</span>
            <h2 className="heading-lg">Our Focus <span className="text-gradient">Subjects</span></h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.15rem', marginTop: '16px' }}>Comprehensive coaching across all major academic streams</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {subjects.map((s, i) => (
              <SubjectCard key={i} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. ACHIEVEMENTS / RESULTS (RESTORED) */}
      <section style={{ padding: '120px 0', position: 'relative' }}>
         <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
             <span className="section-label">Trust & Excellence</span>
             <h2 className="heading-lg">Our Results <span className="text-gradient">Speak</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="heading-xl" style={{ color: 'var(--primary)', fontSize: '4rem', fontWeight: 900 }}>
                <AnimatedCounter end={data.stats.studentsMentored} suffix={data.stats.studentsMentoredSuffix} />
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Students Mentored</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="heading-xl" style={{ color: 'var(--secondary)', fontSize: '4rem', fontWeight: 900 }}>
                <AnimatedCounter end={data.stats.scoredAbove90} suffix={data.stats.scoredAbove90Suffix} />
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scored Above 90%</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <div className="heading-xl" style={{ color: 'var(--primary)', fontSize: '4rem', fontWeight: 900 }}>
                <AnimatedCounter end={data.stats.highestScore} suffix={data.stats.highestScoreSuffix} />
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Highest Board Score</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. EMOTIONAL / FINAL CTA (RESTORED) */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
          <div className="container">
            <div style={{ 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
              borderRadius: '40px', 
              padding: '100px 40px', 
              textAlign: 'center', 
              position: 'relative', 
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(15, 23, 42, 0.2)'
            }}>
               <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(47,128,237,0.1) 0%, transparent 60%)' }}></div>
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 style={{ position: 'relative', zIndex: 1 }}
               >
                 <h2 className="heading-lg" style={{ color: 'white', marginBottom: '20px' }}>"Every topper was once a beginner"</h2>
                 <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '20px' }}>Start Your Journey Today</h3>
                 <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>Join our community of high achievers and take control of your academic future.</p>
                 <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                   <Link to="/contact" className="btn-primary" style={{ padding: '18px 45px', fontSize: '1.1rem' }}>
                      Enroll Now <CheckCircle2 size={20} />
                   </Link>
                 </div>
               </motion.div>
            </div>
          </div>
      </section>

      {/* Sticky Bottom Bar CTA */}
      <div className="desktop-only" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '14px 0', zIndex: 9999 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="nav-live-dot" style={{ background: '#4ade80' }}></div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-dark)' }}>Join our Top-Batch 2026-27 | Limited Seats</span>
          </div>
          <button onClick={() => window.open(`https://wa.me/${data.general.phone}`, '_blank')} className="btn-primary" style={{ padding: '10px 28px', fontSize: '0.9rem' }}>Reserve Your Spot</button>
        </div>
      </div>

    </div>
  );
};

export default Home;
