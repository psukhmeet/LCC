import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  MessageSquare,
  UserCheck,
  Radio,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Settings, label: 'Site Config', path: '/admin/settings' },
    { icon: Users, label: 'Manage Tutors', path: '/admin/tutors' },
    { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries' },
    { icon: UserCheck, label: 'Authorized Teachers', path: '/admin/teachers' },
    { icon: Radio, label: 'Live Classes', path: '/admin/classes' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8' }}>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)',
              zIndex: 40, display: window.innerWidth > 1024 ? 'none' : 'block'
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '0px', opacity: sidebarOpen ? 1 : 0 }}
        style={{
          background: 'white',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          overflow: 'hidden',
          position: window.innerWidth < 1024 ? 'fixed' : 'relative',
          height: '100vh',
          left: 0,
          top: 0
        }}
      >
        <div style={{ padding: '30px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoImg} alt="Learnwood" style={{ width: '32px', height: '32px' }} />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>
            Learnwood <span style={{ color: 'var(--primary)', fontSize: '0.8rem', verticalAlign: 'middle' }}>ADMIN</span>
          </span>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', padding: '0 16px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <button
            onClick={() => navigate('/')}
            className="admin-sidebar-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <Globe size={20} />
            <span>Go to Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="admin-sidebar-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: '80px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          zIndex: 30,
          position: 'sticky',
          top: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ display: 'none', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '10px 16px', borderRadius: '12px', width: '300px' }} className="lg-flex">
              <Search size={18} color="#94A3B8" />
              <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
              <Bell size={22} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>SUKHMEET SINGH</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Administrator</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                AS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
