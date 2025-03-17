import React from 'react';
import { Donation } from '../../services/dashboardService';

interface UserStatsProps {
  donations: Donation[];
  userProfile: any | null;
}

const UserStats: React.FC<UserStatsProps> = ({ donations, userProfile }) => {
  // Calculate total blood donated (in ml)
  const totalBloodDonated = donations.reduce((sum, donation) => sum + donation.blood_amount_ml, 0);
  
  // Calculate donations by type
  const donationsByType = donations.reduce((acc, donation) => {
    const type = donation.donation_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average interval between donations (in days)
  const calculateAverageDonationInterval = () => {
    if (donations.length < 2) return 'N/A';
    
    // Sort donations by date (oldest first)
    const sortedDonations = [...donations].sort(
      (a, b) => new Date(a.donation_date).getTime() - new Date(b.donation_date).getTime()
    );
    
    let totalDays = 0;
    for (let i = 1; i < sortedDonations.length; i++) {
      const prevDate = new Date(sortedDonations[i - 1].donation_date);
      const currDate = new Date(sortedDonations[i].donation_date);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
    }
    
    const averageDays = Math.round(totalDays / (sortedDonations.length - 1));
    return `${averageDays} days`;
  };

  // Calculate potential lives saved (rough estimate: 1 donation can save up to 3 lives)
  const potentialLivesSaved = donations.length * 3;

  return (
    <div className="dashboard-card stats-card">
      <h2>Your Impact</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{userProfile?.donation_count || 0}</div>
          <div className="stat-label">Total Donations</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {totalBloodDonated > 0 
              ? `${(totalBloodDonated / 1000).toFixed(1)}L` 
              : '0L'}
          </div>
          <div className="stat-label">Blood Donated</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{potentialLivesSaved}</div>
          <div className="stat-label">Lives Potentially Saved</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{calculateAverageDonationInterval()}</div>
          <div className="stat-label">Avg. Interval</div>
        </div>
      </div>

      {Object.keys(donationsByType).length > 0 && (
        <div className="donation-types">
          <h3>Donation Types</h3>
          <ul className="donation-types-list">
            {Object.entries(donationsByType).map(([type, count]) => (
              <li key={type}>
                <span className="donation-type">{type}</span>
                <span className="donation-count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserStats; 