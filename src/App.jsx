import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppCTA from './components/ui/WhatsAppCTA';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Tutors from './pages/Tutors';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveClass from './pages/LiveClass';
import About from './pages/About';
import Profile from './pages/Profile';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTutors from './pages/admin/AdminTutors';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminClasses from './pages/admin/AdminClasses';
import AdminNotifications from './pages/admin/AdminNotifications';

/* ─── Main layout wrapper — hides nav/footer on classroom/admin pages ─── */
const AppContent = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const isClassroomRoute = location.pathname.startsWith('/live');
  const isAdminRoute     = location.pathname.startsWith('/admin');
  const isAuthRoute      = ['/login'].includes(location.pathname);
  const isFullPage       = isClassroomRoute || isAuthRoute || isAdminRoute;

  // Local Admin Guard
  const ProtectedAdmin = ({ children }) => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) return <Navigate to="/admin" replace />;
    return <AdminLayout>{children}</AdminLayout>;
  };

  useEffect(() => {
    if (!isClassroomRoute) {
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [location.pathname, isClassroomRoute, shouldReduceMotion]);

  return (
    <div className={isFullPage ? '' : 'app-container'}>
      {!isFullPage && <Navbar />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className={isFullPage ? '' : 'main-content'}
          style={isFullPage ? { height: '100vh', width: '100vw' } : {}}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location} key={location.pathname}>
            {/* ── Public ── */}
            <Route path="/"                 element={<Home />} />
            <Route path="/about"            element={<About />} />
            <Route path="/tutors"           element={<Tutors />} />
            <Route path="/contact"          element={<Contact />} />
            <Route path="/privacy-policy"   element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/login"            element={<Login />} />

            {/* ── Admin ── */}
            <Route path="/admin"            element={<AdminLogin />} />
            
            <Route path="/admin/dashboard"  element={<ProtectedAdmin><AdminOverview /></ProtectedAdmin>} />
            <Route path="/admin/settings"   element={<ProtectedAdmin><AdminSettings /></ProtectedAdmin>} />
            <Route path="/admin/tutors"     element={<ProtectedAdmin><AdminTutors /></ProtectedAdmin>} />
            <Route path="/admin/inquiries"  element={<ProtectedAdmin><AdminInquiries /></ProtectedAdmin>} />
            <Route path="/admin/teachers"   element={<ProtectedAdmin><AdminTeachers /></ProtectedAdmin>} />
            <Route path="/admin/classes"    element={<ProtectedAdmin><AdminClasses /></ProtectedAdmin>} />
            <Route path="/admin/notifications" element={<ProtectedAdmin><AdminNotifications /></ProtectedAdmin>} />

            {/* ── Protected: requires auth ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* ── Protected: requires auth + enrollment ── */}
            <Route path="/live/:classId" element={
              <ProtectedRoute>
                <LiveClass />
              </ProtectedRoute>
            } />

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!isFullPage && <WhatsAppCTA />}
      {!isFullPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
