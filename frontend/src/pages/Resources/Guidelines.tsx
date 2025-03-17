import React from 'react';

const Guidelines: React.FC = () => {
  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Blood Donation Guidelines</h1>
        <p>Learn about eligibility requirements and how to prepare for your donation.</p>
      </div>

      <div className="guidelines-container">
        <section className="guideline-section">
          <h2>Basic Eligibility Requirements</h2>
          <div className="eligibility-card">
            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="eligibility-content">
                <h3>Age</h3>
                <p>You must be at least 17 years old in most states (16 years old with parental consent in some states).</p>
              </div>
            </div>

            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-weight"></i>
              </div>
              <div className="eligibility-content">
                <h3>Weight</h3>
                <p>You must weigh at least 110 pounds (50 kg). Additional weight requirements apply for donors younger than 18 years.</p>
              </div>
            </div>

            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="eligibility-content">
                <h3>Health</h3>
                <p>You must be in good general health and feeling well on the day of donation. You should not have a fever, sore throat, or other infections.</p>
              </div>
            </div>

            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="eligibility-content">
                <h3>Time Between Donations</h3>
                <p>You must wait at least 8 weeks (56 days) between whole blood donations and 16 weeks (112 days) between double red cell donations.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="guideline-section">
          <h2>Preparation Tips</h2>
          <div className="preparation-steps">
            <div className="preparation-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Stay Hydrated</h3>
                <p>Drink an extra 16 oz of water or other non-alcoholic fluids before your donation.</p>
              </div>
            </div>

            <div className="preparation-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Eat a Healthy Meal</h3>
                <p>Eat a healthy meal, avoiding fatty foods like hamburgers, fries, or ice cream before donating.</p>
              </div>
            </div>

            <div className="preparation-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get a Good Night's Sleep</h3>
                <p>Make sure you get at least 7-8 hours of sleep the night before your donation.</p>
              </div>
            </div>

            <div className="preparation-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Wear Comfortable Clothing</h3>
                <p>Wear clothing with sleeves that can be rolled up above the elbow.</p>
              </div>
            </div>

            <div className="preparation-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Bring ID</h3>
                <p>Bring your donor card, driver's license, or two other forms of identification.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="guideline-section">
          <h2>Temporary Deferrals</h2>
          <p className="section-intro">Some conditions may temporarily prevent you from donating blood. These include:</p>
          
          <div className="deferral-grid">
            <div className="deferral-item">
              <i className="fas fa-pills"></i>
              <h3>Medications</h3>
              <p>Some medications may require a waiting period. Bring a list of your medications to your appointment.</p>
            </div>
            
            <div className="deferral-item">
              <i className="fas fa-plane"></i>
              <h3>Travel</h3>
              <p>Recent travel to certain countries may temporarily defer you from donating. Check with your donation center.</p>
            </div>
            
            <div className="deferral-item">
              <i className="fas fa-syringe"></i>
              <h3>Vaccinations</h3>
              <p>Recent vaccinations may require a waiting period before donation.</p>
            </div>
            
            <div className="deferral-item">
              <i className="fas fa-tint"></i>
              <h3>Low Iron</h3>
              <p>Low hemoglobin or iron levels may temporarily defer you from donating.</p>
            </div>
            
            <div className="deferral-item">
              <i className="fas fa-head-side-cough"></i>
              <h3>Illness</h3>
              <p>You should be symptom-free from cold, flu, or other infections on donation day.</p>
            </div>
            
            <div className="deferral-item">
              <i className="fas fa-tooth"></i>
              <h3>Dental Work</h3>
              <p>Recent dental work may require a waiting period before donation.</p>
            </div>
          </div>
        </section>

        <section className="guideline-section">
          <h2>The Donation Process</h2>
          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="timeline-content">
                <h3>Registration</h3>
                <p>You'll complete a donor registration form and show your ID.</p>
                <p className="timeline-time">5 minutes</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <div className="timeline-content">
                <h3>Health History & Mini-Physical</h3>
                <p>You'll answer questions about your health history and receive a quick check of temperature, pulse, blood pressure, and hemoglobin levels.</p>
                <p className="timeline-time">10-15 minutes</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-tint"></i>
              </div>
              <div className="timeline-content">
                <h3>The Donation</h3>
                <p>A sterile needle is inserted for the actual blood donation. The donation itself usually takes about 8-10 minutes.</p>
                <p className="timeline-time">8-10 minutes</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-cookie"></i>
              </div>
              <div className="timeline-content">
                <h3>Refreshments & Recovery</h3>
                <p>After donating, you'll receive refreshments and rest for 10-15 minutes before leaving.</p>
                <p className="timeline-time">10-15 minutes</p>
              </div>
            </div>
          </div>
        </section>

        <div className="guidelines-note">
          <i className="fas fa-info-circle"></i>
          <p>These guidelines are general. Specific eligibility criteria may vary by donation center and country. Always check with your local blood donation center for the most accurate and up-to-date information.</p>
        </div>
      </div>
    </div>
  );
};

export default Guidelines; 