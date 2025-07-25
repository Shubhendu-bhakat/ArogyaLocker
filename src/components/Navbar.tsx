import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Arogya Locker
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/documents" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Documents
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/chat" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Chat
            </Link>
          </li>
          <li className="nav-item">
            {isAuthenticated ? (
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="nav-button login-button" onClick={handleLogin}>
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 