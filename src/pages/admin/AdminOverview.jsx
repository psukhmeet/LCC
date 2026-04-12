import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import { Users, MessageSquare, Radio, ShieldCheck, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Chart from 'react-apexcharts';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminOverview = () => {
  const { data } = useContext(DataContext);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    teachers: 0,
    students: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    liveClasses: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState('online');

  const fetchFullDashboard = async () => {
    setLoading(true);
    try {
      // Parallel data fetching for performance
      const [usersSnap, inquiriesSnap, unreadSnap, liveSnap, recentSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'inquiries')),
        getDocs(query(collection(db, 'inquiries'), where('read', '==', false))),
        getDocs(query(collection(db, 'classes'), where('isLive', '==', true))),
        getDocs(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(5)))
      ]);

      const users = usersSnap.docs.map(d => d.data());
      const teachers = users.filter(u => u.role === 'teacher').length;
      const students = users.filter(u => u.role === 'student').length;

      setStatsData({
        totalUsers: usersSnap.size,
        teachers,
        students,
        totalInquiries: inquiriesSnap.size,
        unreadInquiries: unreadSnap.size,
        liveClasses: liveSnap.size
      });

      setRecentActivities(recentSnap.docs.map(d => ({ 
        id: d.id, 
        type: 'inquiry',
        title: `Message from ${d.data().name}`, 
        time: d.data().createdAt?.toDate() || new Date() 
      })));

      setSystemStatus('online');
    } catch (err) {
      console.error('Dashboard Error:', err);
      setSystemStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFullDashboard(); }, []);

  const topStats = [
    { label: 'Total Profiles', value: statsData.totalUsers, icon: Users, color: '#3B82F6', info: `${statsData.students} Students / ${statsData.teachers} Teachers` },
    { label: 'Total Inquiries', value: statsData.totalInquiries, icon: MessageSquare, color: '#10B981', info: `${statsData.unreadInquiries} Unread Messages`, highlight: statsData.unreadInquiries > 0 },
    { label: 'Tutors On-Board', value: data.tutors.length, icon: ShieldCheck, color: '#F59E0B', info: 'Registered Staff' },
    { label: 'Live Classes', value: statsData.liveClasses, icon: Radio, color: '#EF4444', info: statsData.liveClasses > 0 ? 'Session Active' : 'No Active Sessions', active: statsData.liveClasses > 0 },
  ];

  const pieOptions = {
    labels: ['Students', 'Teachers'],
    colors: ['#2F80ED', '#F59E0B'],
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%' } } },
    dataLabels: { enabled: false }
  };

  const lineOptions = {
    chart: { type: 'area', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], axisBorder: { show: false } },
    yaxis: { show: false },
    grid: { show: false },
    colors: ['#2F80ED'],
    fill: { opacity: 0.1 }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>Dashboard Command Center</h1>
          <p style={{ color: '#64748B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Welcome back, <strong style={{color: 'var(--text-dark)'}}>SUKHMEET SINGH</strong>. 
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: systemStatus === 'online' ? '#DCFCE7' : '#FEE2E2', color: systemStatus === 'online' ? '#166534' : '#991B1B', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
              {systemStatus === 'online' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              SYSTEM {systemStatus.toUpperCase()}
            </span>
          </p>
        </div>
        <button onClick={fetchFullDashboard} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px' }}>
          <Activity size={16} className={loading ? 'animate-spin' : ''} /> Sync Database
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {topStats.map((stat, idx) => (
          <div key={idx} className="admin-stat-card" style={{ borderLeft: stat.highlight ? '4px solid #F59E0B' : '1px solid rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: '10px', borderRadius: '10px' }}>
                <stat.icon size={20} />
              </div>
              {stat.active && <div className="animate-pulse" style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></div>}
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-dark)' }}>{loading ? '...' : stat.value}</h3>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', margin: 0 }}>{stat.label}</p>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>{stat.info}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 1fr', 
        gap: '30px' 
      }}>
        
        {/* Engagement Chart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Interaction Trends</h3>
          <Chart options={lineOptions} series={[{ name: 'Inquiries', data: [31, 40, 28, 51, 42, 109] }]} type="area" height={280} />
        </div>

        {/* User Distribution Pie */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', alignSelf: 'flex-start' }}>Role Distribution</h3>
          {loading ? <p>Calculating...</p> : (
            <Chart options={pieOptions} series={[statsData.students, statsData.teachers]} type="donut" width="100%" />
          )}
        </div>
      </div>

      {/* Footer Activities Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Recent Activity List */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Recent Audit Trail</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map(act => (
              <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={14} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{act.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>New website inquiry received</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{act.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips or Server Info */}
        <div style={{ background: 'var(--primary)', color: 'white', padding: '30px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Pro Tip: Active Sessions</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.6 }}>
              You currently have <strong>{statsData.liveClasses}</strong> active live sessions. 
              Monitor interaction trends in the left chart to optimize your schedule!
            </p>
            <button onClick={() => window.location.href='/admin/inquiries'} style={{ marginTop: '20px', background: 'white', color: 'var(--primary)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              Handle Unread ({statsData.unreadInquiries})
            </button>
          </div>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
             <ShieldCheck size={180} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminOverview;
