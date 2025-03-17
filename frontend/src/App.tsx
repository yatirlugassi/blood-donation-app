import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './index.css';
import './styles/Dashboard.css';
import './styles/SocialSharing.css';
import './styles/Leaderboard.css';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';
import HomePage from './pages/Home';
import Dashboard from './components/Dashboard/Dashboard';
import CompatibilityChecker from './components/CompatibilityChecker';
import RegionalDistribution from './components/RegionalDistribution';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import TestLogin from './components/Auth/TestLogin';
import DiagnosticPage from './components/Auth/DiagnosticPage';
import SimpleConnectionTest from './components/Auth/SimpleConnectionTest';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Resource Pages
import { FAQ, DonationCenters, Guidelines, Research } from './pages/Resources';

// Policy Pages
import { PrivacyPolicy, TermsOfService, CookiePolicy } from './pages/Policies';

// About Page Component
const AboutPage: React.FC = () => {
  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>About Blood Donation Awareness</h1>
        <p>Learn about our mission and the importance of blood donation.</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Blood Donation Awareness, our mission is to educate the public about the critical 
            importance of blood donation and to connect potential donors with donation centers. 
            We believe that through awareness and education, we can increase the number of regular 
            blood donors and help save countless lives.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Why Blood Donation Matters</h2>
          <p>
            Blood donation is a vital lifeline for millions of people worldwide. Every day, 
            thousands of patients rely on the generosity of blood donors to survive surgeries, 
            cancer treatments, chronic illnesses, and traumatic injuries. A single donation can 
            save up to three lives, making it one of the most impactful ways to help others.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Platform</h2>
          <p>
            Our platform provides tools for donors to track their donations, learn about blood 
            compatibility, view regional blood supply data, and connect with donation centers. 
            We aim to make the blood donation process as transparent and accessible as possible, 
            empowering donors with information and resources.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Join Our Community</h2>
          <p>
            By joining our community, you become part of a global movement dedicated to saving 
            lives through blood donation. Whether you're a first-time donor or have been donating 
            for years, your contribution makes a significant difference in the lives of patients 
            in need.
          </p>
        </section>
      </div>
    </div>
  );
};

// Main content with routes
const MainContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <>
      {!isHomePage && <Header />}
      <main className={`main-content ${isHomePage ? 'home-page' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/compatibility" element={<CompatibilityChecker />} />
          <Route path="/regional-data" element={<RegionalDistribution />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/test-login" element={<TestLogin />} />
          <Route path="/diagnostics" element={<DiagnosticPage />} />
          <Route path="/simple-test" element={<SimpleConnectionTest />} />
          
          {/* Resource Routes */}
          <Route path="/resources/faq" element={<FAQ />} />
          <Route path="/resources/donation-centers" element={<DonationCenters />} />
          <Route path="/resources/guidelines" element={<Guidelines />} />
          <Route path="/resources/research" element={<Research />} />
          
          {/* About Page Route */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* Policy Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist or has been moved.</p>
            </div>
          } />
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => {
  // Add this console log to check environment variables
  console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
  console.log('Supabase Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Key exists' : 'Key missing');
  
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <MainContent />
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 