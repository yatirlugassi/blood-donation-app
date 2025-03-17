import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Save Lives Through Blood Donation</h1>
        <p>
          Every donation can save up to three lives. Learn about blood compatibility,
          regional needs, and how you can make a difference.
        </p>
        <div className="hero-buttons">
          <Link to="/compatibility" className="primary-btn">
            Check Compatibility
          </Link>
          <Link to="/register" className="secondary-btn">
            Join Our Community
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <div className="image-container">
          {/* We'll use CSS background for the image */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 