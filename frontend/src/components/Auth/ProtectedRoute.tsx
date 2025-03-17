import React, { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, refreshSession } = useAuth();
  const hasAttemptedRefresh = useRef(false);
  
  // Refresh session only once when component mounts and no user is found
  useEffect(() => {
    const attemptRefresh = async () => {
      if (!user && !loading && !hasAttemptedRefresh.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log('ProtectedRoute: No user found, refreshing session');
        }
        hasAttemptedRefresh.current = true;
        await refreshSession();
      }
    };
    
    attemptRefresh();
  }, [user, loading, refreshSession]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute: No user found, redirecting to login');
    }
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute; 