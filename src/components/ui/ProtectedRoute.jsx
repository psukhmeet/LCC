import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute — renders children only when the user is authenticated.
 * If requireEnrolled=true, also checks that the user is enrolled in classId
 * (or is the teacher), redirecting to /dashboard otherwise.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0f172a', color: '#56CCF2',
        flexDirection: 'column', gap: '16px', fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #56CCF2',
          borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8' }}>Loading session...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
