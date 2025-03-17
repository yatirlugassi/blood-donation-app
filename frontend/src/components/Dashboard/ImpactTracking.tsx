import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartPulse, 
  faPeopleGroup, 
  faTrophy, 
  faChartLine,
  faHandHoldingHeart,
  faGift
} from '@fortawesome/free-solid-svg-icons';
import { Donation } from '../../services/dashboardService';

interface Impact {
  livesSaved: number;
  totalDonations: number;
  totalVolume: number; // in mL
  donationStreak: number;
  longestStreak: number;
  lastDonation: string | null;
  pointsEarned: number;
  badgesEarned: number;
  rankProgress: number;
  rank: string;
}

interface ImpactTrackingProps {
  userId: string;
  donations: Donation[];
}

const ImpactTracking: React.FC<ImpactTrackingProps> = ({ userId, donations }) => {
  const [impact, setImpact] = useState<Impact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<'all' | 'year' | 'month'>('all');
  
  // Calculate impact stats based on donations
  useEffect(() => {
    setLoading(true);
    
    // In a real application, this would be a backend API call
    // Here we'll calculate it on the front-end for demonstration
    setTimeout(() => {
      // Filter donations based on timeframe
      const filteredDonations = filterDonationsByTimeframe(donations, timeframe);
      
      // Calculate impact metrics
      const totalDonations = filteredDonations.length;
      // Assuming each donation is about 450mL for whole blood
      const totalVolume = filteredDonations.length * 450;
      
      // A typical blood donation can help up to 3 people
      // This is a simplified calculation - real calculations would be more complex
      const livesSaved = Math.floor(totalDonations * 3);
      
      // Calculate streak (consecutive monthly donations)
      let currentStreak = 0;
      let longestStreak = 0;
      let lastDonationDate = null;
      
      if (totalDonations > 0) {
        // Sort donations by date (newest first)
        const sortedDonations = [...filteredDonations].sort(
          (a, b) => new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime()
        );
        
        lastDonationDate = sortedDonations[0].donation_date;
        
        // Simple streak calculation (in a real app, this would be more sophisticated)
        // This is just for demonstration purposes
        currentStreak = calculateDonationStreak(sortedDonations);
        longestStreak = Math.max(currentStreak, 3); // Mock value for demonstration
      }
      
      // Calculate donor status/rank based on donations
      const { rank, rankProgress } = calculateDonorRank(totalDonations);
      
      // In a real app, these would come from a gamification system
      const pointsEarned = totalDonations * 100;
      const badgesEarned = Math.min(Math.floor(totalDonations / 2), 10);
      
      setImpact({
        livesSaved,
        totalDonations,
        totalVolume,
        donationStreak: currentStreak,
        longestStreak,
        lastDonation: lastDonationDate,
        pointsEarned,
        badgesEarned,
        rankProgress,
        rank
      });
      
      setLoading(false);
    }, 1000);
  }, [userId, donations, timeframe]);
  
  // Helper function to filter donations by timeframe
  const filterDonationsByTimeframe = (donations: Donation[], timeframe: 'all' | 'year' | 'month'): Donation[] => {
    if (timeframe === 'all') return donations;
    
    const now = new Date();
    const startDate = new Date();
    
    if (timeframe === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (timeframe === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    return donations.filter(donation => {
      const donationDate = new Date(donation.donation_date);
      return donationDate >= startDate && donationDate <= now;
    });
  };
  
  // Helper function to calculate donation streak
  const calculateDonationStreak = (sortedDonations: Donation[]): number => {
    // This is a simplified calculation
    // In a real app, this would consider donation eligibility intervals
    return Math.min(sortedDonations.length, 5); // Just for demonstration
  };
  
  // Helper function to calculate donor rank
  const calculateDonorRank = (totalDonations: number): { rank: string; rankProgress: number } => {
    if (totalDonations >= 50) {
      return { rank: 'Platinum', rankProgress: 100 };
    } else if (totalDonations >= 25) {
      const progress = ((totalDonations - 25) / 25) * 100;
      return { rank: 'Gold', rankProgress: progress };
    } else if (totalDonations >= 10) {
      const progress = ((totalDonations - 10) / 15) * 100;
      return { rank: 'Silver', rankProgress: progress };
    } else if (totalDonations >= 3) {
      const progress = ((totalDonations - 3) / 7) * 100;
      return { rank: 'Bronze', rankProgress: progress };
    } else {
      const progress = (totalDonations / 3) * 100;
      return { rank: 'Newcomer', rankProgress: progress };
    }
  };
  
  // Format volume for display (convert mL to appropriate units)
  const formatVolume = (volumeInML: number): string => {
    if (volumeInML >= 1000) {
      return `${(volumeInML / 1000).toFixed(1)}L`;
    }
    return `${volumeInML}mL`;
  };
  
  return (
    <div className="impact-tracking">
      <div className="impact-header">
        <h2>Your Donation Impact</h2>
        <div className="timeframe-filters">
          <button 
            className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'year' ? 'active' : ''}`}
            onClick={() => setTimeframe('year')}
          >
            Last Year
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
            onClick={() => setTimeframe('month')}
          >
            Last Month
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-impact">
          <div className="spinner"></div>
          <p>Calculating your impact...</p>
        </div>
      ) : impact ? (
        <div className="impact-content">
          {/* Main Impact Stats */}
          <div className="impact-stats">
            <div className="impact-stat-card lives-saved">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faHeartPulse} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{impact.livesSaved}</div>
                <div className="stat-label">Lives Impacted</div>
              </div>
            </div>
            
            <div className="impact-stat-card donations-given">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{impact.totalDonations}</div>
                <div className="stat-label">Donations Given</div>
              </div>
            </div>
            
            <div className="impact-stat-card volume-donated">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faGift} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatVolume(impact.totalVolume)}</div>
                <div className="stat-label">Blood Donated</div>
              </div>
            </div>
          </div>
          
          {/* Donation Streak Section */}
          <div className="impact-streak-section">
            <h3>
              <FontAwesomeIcon icon={faTrophy} />
              Donation Streak
            </h3>
            
            <div className="streak-stats">
              <div className="current-streak">
                <div className="streak-value">{impact.donationStreak}</div>
                <div className="streak-label">Current Streak</div>
              </div>
              
              <div className="streak-divider"></div>
              
              <div className="longest-streak">
                <div className="streak-value">{impact.longestStreak}</div>
                <div className="streak-label">Longest Streak</div>
              </div>
            </div>
            
            <div className="streak-message">
              {impact.donationStreak > 0 ? (
                <p>Keep it up! You're on a roll with your donation commitment.</p>
              ) : (
                <p>Schedule your next donation to start a new streak!</p>
              )}
            </div>
          </div>
          
          {/* Donor Level Progress */}
          <div className="donor-level-section">
            <h3>
              <FontAwesomeIcon icon={faChartLine} />
              Donor Status
            </h3>
            
            <div className="donor-rank">
              <div className="rank-badge">{impact.rank}</div>
              <div className="rank-progress">
                <div className="progress-label">
                  <span>Progress to next level</span>
                  <span>{Math.round(impact.rankProgress)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${impact.rankProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="rank-benefits">
              <h4>Your {impact.rank} Benefits:</h4>
              <ul>
                {impact.rank === 'Newcomer' && (
                  <>
                    <li>Special first-time donor recognition</li>
                    <li>Mobile app access</li>
                    <li>Digital donation certificate</li>
                  </>
                )}
                {(impact.rank === 'Bronze' || impact.rank === 'Silver' || impact.rank === 'Gold' || impact.rank === 'Platinum') && (
                  <>
                    <li>Priority scheduling at donation centers</li>
                    <li>Exclusive donor events access</li>
                    <li>Personalized health insights</li>
                  </>
                )}
                {(impact.rank === 'Silver' || impact.rank === 'Gold' || impact.rank === 'Platinum') && (
                  <>
                    <li>Partner discounts and offers</li>
                    <li>Commemorative donor items</li>
                  </>
                )}
                {(impact.rank === 'Gold' || impact.rank === 'Platinum') && (
                  <>
                    <li>VIP donor lounge access</li>
                    <li>Early access to health webinars</li>
                  </>
                )}
                {impact.rank === 'Platinum' && (
                  <>
                    <li>Annual recognition ceremony invitation</li>
                    <li>Custom platinum donor card</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          {/* Community Impact */}
          <div className="community-impact-section">
            <h3>
              <FontAwesomeIcon icon={faPeopleGroup} />
              Your Community Impact
            </h3>
            
            <div className="community-stats">
              <div className="community-stat">
                <div className="community-value">{impact.totalDonations > 0 ? 'Top 20%' : 'Join today!'}</div>
                <div className="community-label">Donor Ranking</div>
              </div>
              
              <div className="community-stat">
                <div className="community-value">{impact.pointsEarned.toLocaleString()}</div>
                <div className="community-label">Impact Points</div>
              </div>
              
              <div className="community-stat">
                <div className="community-value">{impact.badgesEarned}</div>
                <div className="community-label">Achievement Badges</div>
              </div>
            </div>
            
            <div className="share-impact">
              <button className="share-btn">
                Share Your Impact
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-impact-data">
          <p>No donation data available to calculate impact.</p>
          <button className="schedule-first-btn">Schedule Your First Donation</button>
        </div>
      )}
    </div>
  );
};

export default ImpactTracking; 