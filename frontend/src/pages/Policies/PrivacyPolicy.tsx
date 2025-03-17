import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="policy-content">
        <section className="policy-section">
          <h2>Introduction</h2>
          <p>
            Blood Donation Awareness ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website or use our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
            please do not access the site.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect 
            via the website includes:
          </p>
          <h3>Personal Data</h3>
          <p>
            Personally identifiable information, such as your name, email address, and telephone number, 
            that you voluntarily give to us when you register with the website or when you choose to 
            participate in various activities related to the website. You are under no obligation to 
            provide us with personal information of any kind, however your refusal to do so may prevent 
            you from using certain features of the website.
          </p>
          <h3>Derivative Data</h3>
          <p>
            Information our servers automatically collect when you access the website, such as your IP 
            address, your browser type, your operating system, your access times, and the pages you have 
            viewed directly before and after accessing the website.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, 
          and customized experience. Specifically, we may use information collected about you via the 
          website to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Fulfill and manage donations and appointments.</li>
            <li>Generate a personal profile about you to make future visits to the website more personalized.</li>
            <li>Increase the efficiency and operation of the website.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the website.</li>
            <li>Notify you of updates to the website.</li>
            <li>Offer new products, services, and/or recommendations to you.</li>
            <li>Perform other business activities as needed.</li>
            <li>Request feedback and contact you about your use of the website.</li>
            <li>Resolve disputes and troubleshoot problems.</li>
            <li>Respond to product and customer service requests.</li>
          </ul>
        </section>
        
        <section className="policy-section">
          <h2>Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          
          <h3>By Law or to Protect Rights</h3>
          <p>
            If we believe the release of information about you is necessary to respond to legal process, 
            to investigate or remedy potential violations of our policies, or to protect the rights, 
            property, and safety of others, we may share your information as permitted or required by 
            any applicable law, rule, or regulation.
          </p>
          
          <h3>Third-Party Service Providers</h3>
          <p>
            We may share your information with third parties that perform services for us or on our behalf, 
            including payment processing, data analysis, email delivery, hosting services, customer service, 
            and marketing assistance.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal 
            information. While we have taken reasonable steps to secure the personal information you provide 
            to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
            and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <p>
            Blood Donation Awareness<br />
            123 Donation Street<br />
            Health City, 12345<br />
            info@blooddonationawareness.org<br />
            +1 (234) 567-890
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 