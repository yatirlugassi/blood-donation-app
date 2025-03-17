import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  // Get user from auth context
  const { user } = useAuth();
  
  // Refs for animation elements
  const infoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [infoRef.current, statsRef.current, actionRef.current, featuresRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => {
      elements.forEach((el) => el && observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-container">
      {/* Enhanced Features Section */}
      <div ref={featuresRef} className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Save Lives</h3>
              <p>One donation can save up to three lives</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Quick Process</h3>
              <p>The donation process takes only 5-10 minutes</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Regular Donations</h3>
              <p>Donate every 56 days to maximize impact</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Join Community</h3>
              <p>Be part of a global movement saving lives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Info Section with Cards */}
      <div ref={infoRef} className="info-section">
        <div className="container">
          <h2 className="section-title">Why Your Donation Matters</h2>
          <div className="section-intro">
            <p>Blood donation is a critical lifeline for millions of people worldwide. Every day, thousands of patients rely on the generosity of blood donors to survive surgeries, cancer treatments, chronic illnesses, and traumatic injuries.</p>
          </div>
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon-wrapper">
                <div className="info-icon">💧</div>
              </div>
              <h3>Life-Saving Resource</h3>
              <p>
                Blood cannot be manufactured – it can only come from generous donors. 
                Every two seconds, someone in the world needs blood for surgeries, cancer treatments, and emergencies.
              </p>
              <Link to="/compatibility" className="card-link">Learn More</Link>
            </div>

            <div className="info-card featured">
              <div className="card-icon-wrapper">
                <div className="info-icon">🩺</div>
              </div>
              <h3>Check Your Eligibility</h3>
              <p>
                Most people in good health, who are at least 17 years old, and weigh at least 110 pounds, 
                can donate blood. Use our compatibility checker to learn about your blood type.
              </p>
              <Link to="/compatibility" className="card-link">Check Compatibility</Link>
            </div>

            <div className="info-card">
              <div className="card-icon-wrapper">
                <div className="info-icon">🌍</div>
              </div>
              <h3>Regional Impact</h3>
              <p>
                Different regions have different blood type needs. Explore our regional distribution 
                map to see where your donation could make the biggest impact in your community.
              </p>
              <Link to="/regional-data" className="card-link">View Map</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Stats Section */}
      <div ref={statsRef} className="stats-section">
        <div className="container">
          <div className="stats-background">
            <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffebee" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          <h2 className="section-title">Blood Donation Impact</h2>
          <div className="section-intro">
            <p>Your donation has a profound impact on patients in need. Here are some key statistics that highlight the importance of blood donation.</p>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-circle">
                <svg viewBox="0 0 36 36">
                  <path className="stat-circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path className="stat-circle-fill"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#d32f2f"
                    strokeWidth="3"
                    strokeDasharray="38, 100"
                  />
                </svg>
                <div className="stat-number">38%</div>
              </div>
              <div className="stat-text">of the population is eligible to donate blood</div>
            </div>
            <div className="stat-item">
              <div className="stat-circle">
                <svg viewBox="0 0 36 36">
                  <path className="stat-circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path className="stat-circle-fill"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#d32f2f"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                </svg>
                <div className="stat-number">3</div>
              </div>
              <div className="stat-text">lives saved with each donation</div>
            </div>
            <div className="stat-item">
              <div className="stat-circle">
                <svg viewBox="0 0 36 36">
                  <path className="stat-circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path className="stat-circle-fill"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#d32f2f"
                    strokeWidth="3"
                    strokeDasharray="14, 100"
                  />
                </svg>
                <div className="stat-number">1/7</div>
              </div>
              <div className="stat-text">people entering a hospital need blood</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section with Testimonial - Only show to non-logged in users */}
      {!user && (
        <div ref={actionRef} className="action-section">
          <div className="container">
            <div className="action-content">
              <div className="testimonial">
                <div className="quote-mark">"</div>
                <p className="quote-text">
                  Donating blood was one of the most rewarding experiences of my life. 
                  Knowing that my simple act could save someone's life gives me immense joy.
                </p>
                <div className="quote-author">
                  <div className="author-avatar"></div>
                  <div className="author-info">
                    <p className="author-name">Sarah Johnson</p>
                    <p className="author-detail">Regular donor since 2018</p>
                  </div>
                </div>
              </div>
              <div className="action-card">
                <h2>Ready to Make a Difference?</h2>
                <p>Join our blood donor community today. Track your donations, set goals, and save lives.</p>
                <div className="action-buttons">
                  <Link to="/register" className="action-button">
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="action-button outline">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Alternative CTA for logged-in users */}
      {user && (
        <div ref={actionRef} className="action-section">
          <div className="container">
            <div className="action-content">
              <div className="testimonial">
                <div className="quote-mark">"</div>
                <p className="quote-text">
                  Thank you for being part of our donor community! Your contributions 
                  are making a real difference in people's lives every day.
                </p>
                <div className="quote-author">
                  <div className="author-avatar"></div>
                  <div className="author-info">
                    <p className="author-name">Blood Donation Awareness Team</p>
                    <p className="author-detail">Grateful for your support</p>
                  </div>
                </div>
              </div>
              <div className="action-card">
                <h2>Continue Your Journey</h2>
                <p>Track your donations, set new goals, and see your impact in the community.</p>
                <div className="action-buttons">
                  <Link to="/dashboard" className="action-button">
                    Go to Dashboard
                  </Link>
                  <Link to="/compatibility" className="action-button outline">
                    Check Compatibility
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 