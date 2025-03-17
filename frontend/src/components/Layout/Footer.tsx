import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="App-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Blood Donation Awareness</h3>
          <p>Our mission is to educate and inspire people about the importance of blood donation, helping save lives through awareness and community engagement.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/compatibility">Compatibility Checker</Link></li>
            <li><Link to="/regional-data">Regional Data</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-section resources">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/resources/faq">Blood Donation FAQ</Link></li>
            <li><Link to="/resources/donation-centers">Find Donation Centers</Link></li>
            <li><Link to="/resources/guidelines">Donation Guidelines</Link></li>
            <li><Link to="/resources/research">Research & Studies</Link></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <span className="contact-icon email"></span>
            <a href="mailto:info@blooddonationawareness.org">info@blooddonationawareness.org</a>
          </p>
          <p>
            <span className="contact-icon phone"></span>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
          </p>
          <p>
            <span className="contact-icon location"></span>
            123 Donation Street, Health City, 12345
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Blood Donation Awareness Project. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 