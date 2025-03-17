import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Cookie Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="policy-content">
        <section className="policy-section">
          <h2>What Are Cookies</h2>
          <p>
            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is 
            stored in your web browser and allows the website or a third-party to recognize you and make your 
            next visit easier and the website more useful to you.
          </p>
          <p>
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer 
            or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>How We Use Cookies</h2>
          <p>
            When you use and access our website, we may place a number of cookie files in your web browser.
          </p>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li>To enable certain functions of the website</li>
            <li>To provide analytics</li>
            <li>To store your preferences</li>
            <li>To enable advertisements delivery, including behavioral advertising</li>
          </ul>
          <p>
            We use both session and persistent cookies on the website and we use different types of cookies to run the website:
          </p>
          <ul>
            <li><strong>Essential cookies.</strong> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
            <li><strong>Preferences cookies.</strong> We may use preferences cookies to remember information that changes the way the website behaves or looks, such as the "remember me" functionality.</li>
            <li><strong>Analytics cookies.</strong> We may use analytics cookies to track information how the website is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the website to see how our users react to them.</li>
            <li><strong>Advertising cookies.</strong> These type of cookies are used to deliver advertisements on and through the website and track the performance of these advertisements. These cookies may also be used to enable third-party advertising networks to deliver ads that may be relevant to you based upon your activities or interests.</li>
          </ul>
        </section>
        
        <section className="policy-section">
          <h2>Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, 
            deliver advertisements on and through the website, and so on.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>What Are Your Choices Regarding Cookies</h2>
          <p>
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
          </p>
          <p>
            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, 
            you may not be able to store your preferences, and some of our pages might not display properly.
          </p>
          <ul>
            <li>For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer">https://support.google.com/accounts/answer/32050</a></li>
            <li>For the Internet Explorer web browser, please visit this page from Microsoft: <a href="http://support.microsoft.com/kb/278835" target="_blank" rel="noopener noreferrer">http://support.microsoft.com/kb/278835</a></li>
            <li>For the Firefox web browser, please visit this page from Mozilla: <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank" rel="noopener noreferrer">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a></li>
            <li>For the Safari web browser, please visit this page from Apple: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></li>
          </ul>
          <p>
            For any other web browser, please visit your web browser's official web pages.
          </p>
        </section>
        
        <section className="policy-section">
          <h2>More Information About Cookies</h2>
          <p>
            You can learn more about cookies at the following third-party websites:
          </p>
          <ul>
            <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer">http://www.networkadvertising.org/</a></li>
            <li>All About Cookies: <a href="http://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">http://www.allaboutcookies.org/</a></li>
          </ul>
        </section>
        
        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us:
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

export default CookiePolicy; 