import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="policy-content">
        <section className="policy-section">
          <h2>Agreement to Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement made between you and Blood Donation Awareness, 
            concerning your access to and use of our website and services. You agree that by accessing the website, 
            you have read, understood, and agree to be bound by all of these Terms of Service.
          </p>
          <p>
            If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the 
            website and you must discontinue use immediately.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the website is our proprietary property and all source code, databases, 
            functionality, software, website designs, audio, video, text, photographs, and graphics on the website 
            (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") 
            are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and 
            various other intellectual property rights.
          </p>
          <p>
            The Content and the Marks are provided on the website "AS IS" for your information and personal use only. 
            Except as expressly provided in these Terms of Service, no part of the website and no Content or Marks may 
            be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, 
            transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, 
            without our express prior written permission.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>User Representations</h2>
          <p>By using the website, you represent and warrant that:</p>
          <ol>
            <li>All registration information you submit will be true, accurate, current, and complete;</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service;</li>
            <li>You are not a minor in the jurisdiction in which you reside;</li>
            <li>You will not access the website through automated or non-human means, whether through a bot, script, or otherwise;</li>
            <li>You will not use the website for any illegal or unauthorized purpose;</li>
            <li>Your use of the website will not violate any applicable law or regulation.</li>
          </ol>
        </section>
        
        <section className="policy-section">
          <h2>User Registration</h2>
          <p>
            You may be required to register with the website. You agree to keep your password confidential and 
            will be responsible for all use of your account and password. We reserve the right to remove, reclaim, 
            or change a username you select if we determine, in our sole discretion, that such username is inappropriate, 
            obscene, or otherwise objectionable.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Prohibited Activities</h2>
          <p>You may not access or use the website for any purpose other than that for which we make the website available. The website may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          
          <p>As a user of the website, you agree not to:</p>
          <ol>
            <li>Systematically retrieve data or other content from the website to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the website.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the website.</li>
            <li>Use any information obtained from the website in order to harass, abuse, or harm another person.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Use the website in a manner inconsistent with any applicable laws or regulations.</li>
            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming, that interferes with any party's uninterrupted use and enjoyment of the website or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the website.</li>
          </ol>
        </section>
        
        <section className="policy-section">
          <h2>Disclaimer</h2>
          <p>
            THE WEBSITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE WEBSITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE WEBSITE AND YOUR USE THEREOF.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            In order to resolve a complaint regarding the website or to receive further information regarding use of the website, please contact us at:
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

export default TermsOfService; 