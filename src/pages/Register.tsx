import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

interface ValidationState {
  email: boolean;
  phone: boolean;
  password: {
    length: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasDigit: boolean;
    hasSpecialChar: boolean;
  };
}

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    email: false,
    phone: false,
    password: {
      length: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    }
  });
  
  const navigate = useNavigate();
  const { signUp, currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Check email, phone and password validation
  useEffect(() => {
    setValidation({
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      phone: /^\d{10}$/.test(phone.replace(/\D/g, '')),
      password: {
        length: password.length >= 8 && password.length <= 30,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasDigit: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)
      }
    });
  }, [email, phone, password]);

  const isPasswordValid = () => {
    const { length, hasUpperCase, hasLowerCase, hasDigit, hasSpecialChar } = validation.password;
    return length && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const isFormValid = () => {
    return (
      name.trim().length > 0 &&
      validation.email &&
      validation.phone &&
      isPasswordValid() &&
      password === confirmPassword
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!validation.email) {
      return setError('Please enter a valid email address');
    }
    
    // Validate phone
    if (!validation.phone) {
      return setError('Please enter a valid 10-digit phone number');
    }
    
    // Validate password
    if (!isPasswordValid()) {
      return setError('Password does not meet the requirements');
    }

    // Validate password match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      await signUp(name, email, password, phone);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to create an account');
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Arogya Locker</h1>
        <h2>Create an account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              className={phone && !validation.phone ? 'invalid' : ''}
              required
            />
            {phone && !validation.phone && (
              <div className="validation-error">Please enter a valid 10-digit phone number</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="password-strength-meter">
              <div className={`strength-item ${validation.password.length ? 'valid' : ''}`}>
                8-30 characters
              </div>
              <div className={`strength-item ${validation.password.hasUpperCase ? 'valid' : ''}`}>
                Uppercase letter
              </div>
              <div className={`strength-item ${validation.password.hasLowerCase ? 'valid' : ''}`}>
                Lowercase letter
              </div>
              <div className={`strength-item ${validation.password.hasDigit ? 'valid' : ''}`}>
                Number
              </div>
              <div className={`strength-item ${validation.password.hasSpecialChar ? 'valid' : ''}`}>
                Special character
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPassword && password !== confirmPassword ? 'invalid' : ''}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="validation-error">Passwords do not match</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading || !isFormValid()}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 