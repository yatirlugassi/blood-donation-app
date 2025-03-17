import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeroHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, refreshSession } = useAuth();
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

  // Refresh session when component mounts
  useEffect(() => {
    if (user) {
      refreshSession();
    }
  }, [user, refreshSession]);

  const handleSignOut = async () => {
    try {
      console.log('HeroHeader: Attempting to sign out...');
      const { error } = await signOut();
      
      if (error) {
        console.error('HeroHeader: Error signing out:', error);
      }
      
      // Always navigate to home page after logout attempt
      console.log('HeroHeader: Redirecting to home page after logout');
      navigate('/');
      
    } catch (error) {
      console.error('HeroHeader: Exception during sign out:', error);
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
    <div className="hero-header-container">
      {/* Header Section */}
      <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
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
                <li>
                  <Link 
                    to="/about" 
                    className={isActive('/about') ? 'active' : ''} 
                    onClick={closeMobileMenu}
                  >
                    About
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
                <Link 
                  to="/register" 
                  className="get-started-btn"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Save Lives With Every Drop</h1>
          <p className="hero-subtitle">Join our community of donors making a difference every day</p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/dashboard" className="primary-button">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="primary-button">
                Donate Now
              </Link>
            )}
            <Link to="/about" className="secondary-button">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;