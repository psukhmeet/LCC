import { motion } from 'framer-motion';
import { Users, Zap, BookOpen, Target, Rocket, CheckCircle2, TrendingUp } from 'lucide-react';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Link } from 'react-router-dom';
const About = () => {
  const { data } = useContext(DataContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container about-page">

      {/* ───────── HERO ───────── */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="heading-xl">
          About <span className="text-gradient">Learnwood Coaching Classes</span>
        </h1>

        <div className="glass about-card">
          <p>
            Learnwood Coaching Classes is a dedicated learning platform committed to helping students
            build strong academic foundations and achieve their educational goals.
          </p>

          <p>
            We focus on concept clarity, problem-solving ability, and confidence building through
            structured teaching and regular practice.
          </p>

          <ul className="about-list">
            <li>Concept-based learning</li>
            <li>Regular revision tests</li>
            <li>Smart tricks & techniques</li>
            <li>Personalized attention</li>
            <li>Continuous improvement</li>
          </ul>

          <blockquote>
            "We create an environment where students learn, practice, and excel with confidence."
          </blockquote>
        </div>
      </motion.section>

      {/* ───────── APPROACH ───────── */}
      <section className="about-approach">

        <div className="approach-text">
          <h2>
            Our <span className="text-gradient">Teaching Approach</span>
          </h2>

          <p>
            We don’t just complete syllabus — we build understanding, logic, and confidence.
          </p>

          <p>
            Our approach combines simplicity, smart techniques, and consistent practice.
          </p>
        </div>

        <motion.div
          className="approach-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: <BookOpen />, text: "Concept-based learning" },
            { icon: <CheckCircle2 />, text: "Revision tests" },
            { icon: <Zap />, text: "Smart tricks" },
            { icon: <Users />, text: "Personal guidance" },
            { icon: <TrendingUp />, text: "Growth tracking" }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="feature-card">
              {item.icon}
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────── MISSION / VISION ───────── */}
      <section className="mission-section">

        <div className="mission-card glass">
          <Rocket size={35} />
          <h3>Our Mission</h3>
          <p>
            To make learning simple, effective, and accessible through modern teaching methods.
          </p>
        </div>

        <div className="mission-card glass">
          <Target size={35} />
          <h3>Our Vision</h3>
          <p>
            To become a trusted institute that builds knowledge, confidence, and success.
          </p>
        </div>

      </section>

      {/* ───────── CTA ───────── */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Start Your Journey with Us</h2>

        <p>
          Join a learning environment where you grow with confidence.
        </p>

        <div className="cta-buttons">
          <Link to="/contact" className="btn-primary light">
            Contact for Counseling
          </Link>

          <Link to="/dashboard" className="btn-outline white">
            Join Live Class
          </Link>
        </div>
      </motion.section>

    </div>
  );
};

export default About;