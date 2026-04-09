import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';
import { FiLogOut, FiVideo, FiClock, FiUsers, FiChevronRight, FiRadio } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser, userProfile, isTeacher } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Keep a live clock for countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch classes
  useEffect(() => {
    if (!currentUser) return;
    const fetchClasses = async () => {
      try {
        let q;
        if (isTeacher) {
          // Teachers can see and start ANY class created by the admin
          q = query(collection(db, 'classes'));
        } else {
          const enrolled = userProfile?.enrolledClasses || [];
          if (enrolled.length === 0) { setClasses([]); setLoading(false); return; }
          q = query(collection(db, 'classes'), where('__name__', 'in', enrolled));
        }
        const snap = await getDocs(q);
        setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Failed to load classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [currentUser, userProfile, isTeacher]);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const handleStartClass = async (classId) => {
    await updateDoc(doc(db, 'classes', classId), { isLive: true, startedAt: serverTimestamp() });
    navigate(`/live/${classId}`);
  };

  const formatCountdown = (scheduledTime) => {
    const diff = scheduledTime - now;
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    return h > 0 ? `${h}h ${pad(m)}m` : `${pad(m)}:${pad(s)}`;
  };

  const canJoin = (cls) => {
    if (cls.isLive) return true;
    if (isTeacher) return false;
    if (!cls.scheduledTime) return false;
    // Allow join 5 min before scheduled
    return (cls.scheduledTime.toMillis() - now) <= 5 * 60 * 1000;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)',
      fontFamily: "'Inter', sans-serif",
      color: 'white',
    }}>
      {/* ─── Header ─── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 32px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #2F80ED, #56CCF2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🎓 Learnwood Coaching
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>{userProfile?.name}</div>
            <div style={{ fontSize: '0.75rem', color: isTeacher ? '#56CCF2' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isTeacher ? '👨‍🏫 Teacher' : '🎒 Student'}
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
          Welcome back, {userProfile?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#64748b', marginBottom: '40px' }}>
          {isTeacher ? 'Manage and start your live teaching sessions.' : 'Join your upcoming live classes below.'}
        </p>

        {/* ─── Class Cards ─── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : classes.length === 0 ? (
          <EmptyState isTeacher={isTeacher} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {classes.map(cls => {
              const scheduled = cls.scheduledTime?.toMillis?.() || null;
              const countdownStr = scheduled ? formatCountdown(scheduled) : null;
              const joinable = canJoin(cls);
              return (
                <div key={cls.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${cls.isLive ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  padding: '24px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Live badge */}
                  {cls.isLive && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.9)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                      LIVE
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #2F80ED22, #56CCF222)', border: '1px solid rgba(86,204,242,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      📚
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{cls.title}</h3>
                      {cls.description && <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0' }}>{cls.description}</p>}
                    </div>
                  </div>

                  {scheduled && countdownStr && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#56CCF2', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <FiClock /> Starts in {countdownStr}
                    </div>
                  )}
                  {scheduled && !countdownStr && !cls.isLive && (
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <FiClock style={{ marginRight: '4px' }} />
                      {new Date(scheduled).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  )}

                  {/* Teacher: start button */}
                  {isTeacher && !cls.isLive && (
                    <button onClick={() => handleStartClass(cls.id)} style={{
                      width: '100%', padding: '11px', background: 'linear-gradient(135deg, #2F80ED, #56CCF2)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                      <FiRadio /> Start Class
                    </button>
                  )}
                  {isTeacher && cls.isLive && (
                    <Link to={`/live/${cls.id}`} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '11px', background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'none',
                    }}>
                      <FiVideo /> Rejoin Live Class
                    </Link>
                  )}

                  {/* Student: join button */}
                  {!isTeacher && (
                    <button onClick={() => navigate(`/live/${cls.id}`)} disabled={!joinable} style={{
                      width: '100%', padding: '11px', background: joinable ? 'linear-gradient(135deg, #2F80ED, #56CCF2)' : 'rgba(255,255,255,0.06)', border: joinable ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: joinable ? 'white' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: joinable ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                      {cls.isLive ? <><FiVideo /> Join Live</> : joinable ? <><FiChevronRight /> Enter Class</> : <><FiClock /> Not Started</>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', animation: 'shimmer 1.5s infinite' }}>
    <div style={{ height: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '12px', width: '60%' }} />
    <div style={{ height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', marginBottom: '20px' }} />
    <div style={{ height: '40px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px' }} />
    <style>{`@keyframes shimmer { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }`}</style>
  </div>
);

const EmptyState = ({ isTeacher }) => (
  <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748b' }}>
    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏫</div>
    <h3 style={{ color: '#94a3b8', marginBottom: '8px' }}>No classes found</h3>
    <p style={{ fontSize: '0.9rem' }}>
      {isTeacher ? 'Create your first class in the Firebase console to get started.' : "You haven't been enrolled in any classes yet. Contact your teacher."}
    </p>
  </div>
);

export default Dashboard;
