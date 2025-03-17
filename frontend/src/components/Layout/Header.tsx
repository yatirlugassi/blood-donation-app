import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for transparent to solid header transition
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Header: Attempting to sign out...');
      const { error } = await signOut();
      
      if (error) {
        console.error('Header: Error signing out:', error);
        navigate('/');
      } else {
        console.log('Header: Sign out successful, redirecting to home page');
        navigate('/');
      }
    } catch (error) {
      console.error('Header: Exception during sign out:', error);
      navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Check if the current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`modern-header inner-page-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            <h1>Blood Donation Awareness</h1>
          </Link>
        </div>

        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-container ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="main-nav">
            <ul>
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''} 
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              {user && (
                <li>
                  <Link 
                    to="/dashboard" 
                    className={isActive('/dashboard') ? 'active' : ''} 
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  to="/compatibility" 
                  className={isActive('/compatibility') ? 'active' : ''} 
                  onClick={closeMobileMenu}
                >
                  Compatibility
                </Link>
              </li>
              <li>
                <Link 
                  to="/regional-data" 
                  className={isActive('/regional-data') ? 'active' : ''} 
                  onClick={closeMobileMenu}
                >
                  Regional Data
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="auth-nav">
            {user ? (
              <>
                <span className="user-greeting">Hello, {user.email?.split('@')[0]}</span>
                <button 
                  onClick={handleSignOut}
                  className="logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`login-btn ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="get-started-btn"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 