import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Users, MessageSquare, Radio, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Chart from 'react-apexcharts';

const AdminOverview = () => {
  const { data } = useContext(DataContext);

  const stats = [
    { label: 'Total Tutors', value: data.tutors.length, icon: Users, color: '#3B82F6', trend: '+2 this month', isUp: true },
    { label: 'Active Classes', value: 0, icon: Radio, color: '#EF4444', trend: 'Live now', isUp: true },
    { label: 'Pending Inquiries', value: 3, icon: MessageSquare, color: '#10B981', trend: '-12% vs last week', isUp: false },
    { label: 'Students Reached', value: data.stats.studentsMentored, icon: TrendingUp, color: '#F59E0B', trend: 'Global footprint', isUp: true },
  ];

  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, sparkline: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100, 100, 100] } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    grid: { show: false },
    colors: ['#2F80ED'],
    tooltip: { theme: 'light' }
  };

  const chartSeries = [{ name: 'Inquiries', data: [31, 40, 28, 51, 42, 109] }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748B', margin: 0 }}>Welcome back, Atul. Here's what's happening today.</p>
      </div>

      {/* Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ 
                background: `rgba(${stat.color === '#3B82F6' ? '59,130,246' : stat.color === '#EF4444' ? '239,68,68' : stat.color === '#10B981' ? '16,185,129' : '245,158,11'}, 0.1)`, 
                color: stat.color,
                padding: '12px',
                borderRadius: '12px'
              }}>
                <stat.icon size={22} />
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700,
                color: stat.isUp ? '#10B981' : '#EF4444'
              }}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-dark)' }}>{stat.value}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Activity Growth</h3>
            <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.85rem' }}>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Quick Actions</h3>
          <button className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem' }}>+ New Live Class</button>
          <button className="btn-outline" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem' }}>View All Inquiries</button>
          <div style={{ marginTop: 'auto', background: 'rgba(47, 128, 237, 0.05)', padding: '20px', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Weekly Update</p>
            <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5 }}>Your website traffic is up by 15% compared to last week. Keep it up!</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminOverview;
