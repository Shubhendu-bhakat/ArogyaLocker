import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    email: false,
    password: false
  });
  
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Update validation when inputs change
  useEffect(() => {
    setValidation({
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      password: password.length >= 8
    });
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!validation.email) {
      return setError('Please enter a valid email address');
    }
    
    // Validate password
    if (!validation.password) {
      return setError('Password must be at least 8 characters');
    }
    
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Arogya Locker</h1>
        <h2>Login to your account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={email && !validation.email ? 'invalid' : ''}
              required
            />
            {email && !validation.email && (
              <div className="validation-error">Please enter a valid email address</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password && !validation.password ? 'invalid' : ''}
              required
            />
            <div className="password-hint">
              Password must be at least 8 characters
            </div>
          </div>
          
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !(validation.email && validation.password)}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 