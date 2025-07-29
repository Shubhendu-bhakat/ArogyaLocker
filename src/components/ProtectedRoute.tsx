import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const name = "sghubhendu"
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Show authentication required message
    return (
      <div className="auth-required-container">
        <div className="auth-required-content">
          <div className="auth-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>Authentication Required</h2>
          <p>You must be logged in to access this page.</p>
          <button onClick={() => window.location.href = '/login'} className="login-btn">
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute; 