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

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

/* ─── Main layout wrapper — hides nav/footer on classroom pages ─── */
const AppContent = () => {
  const location = useLocation();
  const isClassroomRoute = location.pathname.startsWith('/live');
  const isAuthRoute      = ['/login'].includes(location.pathname);
  const isFullPage       = isClassroomRoute || isAuthRoute;

  return (
    <div className={isFullPage ? '' : 'app-container'}>
      {!isFullPage && <Navbar />}

      <main
        className={isFullPage ? '' : 'main-content'}
        style={isFullPage ? { height: '100vh', width: '100vw' } : {}}
      >
        <Routes>
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
          <Route path="/admin/dashboard"  element={<AdminDashboard />} />

          {/* ── Protected: requires auth ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
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
      </main>

      {!isFullPage && <WhatsAppCTA />}
      {!isFullPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
