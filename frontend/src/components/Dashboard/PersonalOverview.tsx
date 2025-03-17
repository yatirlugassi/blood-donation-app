import React from 'react';
import { Donation } from '../../services/dashboardService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDroplet, 
  faUserCheck, 
  faHeartbeat, 
  faCalendarCheck, 
  faAward,
  faUsers,
  faClock
} from '@fortawesome/free-solid-svg-icons';

interface UserProfile {
  id: string;
  blood_type: string | null;
  region: string | null;
  donation_count: number;
  last_donation_date: string | null;
  created_at: string;
}

interface PersonalOverviewProps {
  userProfile: UserProfile | null;
  donations: Donation[];
}

const PersonalOverview: React.FC<PersonalOverviewProps> = ({ userProfile, donations }) => {
  if (!userProfile) {
    return (
      <div className="personal-overview-loading">
        <h3>Loading your profile information...</h3>
      </div>
    );
  }

  // Calculate next donation date (56 days from last donation for whole blood)
  const calculateNextDonationDate = (): { date: Date | null; daysRemaining: number } => {
    if (!userProfile.last_donation_date) return { date: null, daysRemaining: 0 };
    
    const lastDonationDate = new Date(userProfile.last_donation_date);
    const nextDonationDate = new Date(lastDonationDate);
    nextDonationDate.setDate(lastDonationDate.getDate() + 56); // 56 days for whole blood
    
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((nextDonationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    return { date: nextDonationDate, daysRemaining };
  };
  
  const { date: nextDonationDate, daysRemaining } = calculateNextDonationDate();
  
  // Calculate donation streak (consecutive quarters with at least one donation)
  const calculateDonationStreak = (): number => {
    if (!donations || donations.length === 0) return 0;
    
    // Sort donations by date (newest first is how they come from the backend)
    const sortedDonations = [...donations];
    
    let streak = 0;
    let currentQuarter = Math.floor(new Date().getMonth() / 3);
    let currentYear = new Date().getFullYear();
    
    // Check each quarter going backwards
    for (let i = 0; i < 20; i++) { // Limit to 20 quarters (5 years)
      const donationsInQuarter = sortedDonations.filter(donation => {
        const donationDate = new Date(donation.donation_date);
        const donationQuarter = Math.floor(donationDate.getMonth() / 3);
        const donationYear = donationDate.getFullYear();
        
        return donationQuarter === currentQuarter && donationYear === currentYear;
      });
      
      if (donationsInQuarter.length > 0) {
        streak++;
        // Move to previous quarter
        currentQuarter--;
        if (currentQuarter < 0) {
          currentQuarter = 3;
          currentYear--;
        }
      } else {
        // Streak broken
        break;
      }
    }
    
    return streak;
  };
  
  const donationStreak = calculateDonationStreak();
  
  // Calculate total impact (1 donation helps up to 3 lives)
  const totalLivesImpacted = userProfile.donation_count * 3;
  
  // Calculate blood type icon styling
  const getBloodTypeIcon = (bloodType: string | null): JSX.Element => {
    if (!bloodType) return <span className="unknown-type">Unknown</span>;
    
    return (
      <div className={`blood-type-icon blood-type-${bloodType.toLowerCase().replace('+', '-positive').replace('-', '-negative')}`}>
        <FontAwesomeIcon icon={faDroplet} className="blood-drop-icon" />
        <span>{bloodType}</span>
      </div>
    );
  };

  return (
    <div className="personal-overview">
      <div className="profile-header">
        <div className="profile-blood-type">
          {getBloodTypeIcon(userProfile.blood_type)}
        </div>
        <div className="profile-details">
          <h2>Your Donor Profile</h2>
          <div className="profile-status">
            <span className="donor-status active">
              <FontAwesomeIcon icon={faUserCheck} />
              Active Donor
            </span>
            <span className="donor-region">
              {userProfile.region || 'Region not set'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="donation-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faDroplet} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{userProfile.donation_count}</div>
            <div className="stat-label">Total Donations</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalLivesImpacted}</div>
            <div className="stat-label">Lives Impacted</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{donationStreak}</div>
            <div className="stat-label">Quarter Streak</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faAward} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {Math.floor(userProfile.donation_count / 5) * 5}
            </div>
            <div className="stat-label">Milestone Target</div>
          </div>
        </div>
      </div>
      
      <div className="next-donation-container">
        <h3>
          <FontAwesomeIcon icon={faCalendarCheck} />
          Next Eligible Donation Date
        </h3>
        
        {nextDonationDate ? (
          <div className="next-donation-info">
            <div className="next-date">
              {nextDonationDate.toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div className="countdown-container">
              {daysRemaining > 0 ? (
                <>
                  <div className="countdown-time">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{daysRemaining} days remaining</span>
                  </div>
                  <div className="countdown-progress">
                    <div 
                      className="countdown-bar" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 100 - (daysRemaining / 56 * 100)))}%` 
                      }}
                    ></div>
                  </div>
                </>
              ) : (
                <div className="eligible-now">
                  <span className="eligible-badge">Eligible Now!</span>
                  <p>You can schedule your next donation today.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-donations-yet">
            <p>No donation history yet. You can donate anytime!</p>
            <button className="schedule-button">Schedule Your First Donation</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalOverview; 