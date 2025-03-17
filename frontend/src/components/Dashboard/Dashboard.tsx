import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getUserDonations, 
  getUserDonationGoals, 
  getUserAchievements,
  getUserReminders,
  DonationGoal,
  Donation, 
  UserAchievement,
  DonationReminder,
  calculateNextDonationDate
} from '../../services/dashboardService';
import DonationHistory from './DonationHistory';
import UserStats from './UserStats';
import AchievementsSection from './AchievementsSection';
import DonationForm from './DonationForm';
import GoalTracker from './GoalTracker';
import RemindersSection from './RemindersSection';
import PersonalOverview from './PersonalOverview';
import BloodSupplyStatus from './BloodSupplyStatus';
import AppointmentManagement from './AppointmentManagement';
import ImpactTracking from './ImpactTracking';
import { supabase } from '../../services/supabaseClient';
import SocialSharing from './SocialSharing';
import Leaderboard from './Leaderboard';

interface UserProfile {
  id: string;
  blood_type: string;
  region: string;
  donation_count: number;
  last_donation_date: string | null;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [goals, setGoals] = useState<DonationGoal[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [reminders, setReminders] = useState<DonationReminder[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setLoading(true);
        
        try {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else {
            setUserProfile(profileData);
          }
          
          // Fetch donations
          const { data: donationsData } = await getUserDonations(user.id);
          if (donationsData) {
            setDonations(donationsData);
          }
          
          // Fetch goals
          const { data: goalsData } = await getUserDonationGoals(user.id);
          if (goalsData) {
            setGoals(goalsData);
          }
          
          // Fetch achievements
          const { data: achievementsData } = await getUserAchievements(user.id);
          if (achievementsData) {
            setAchievements(achievementsData);
          }
          
          // Fetch reminders
          const { data: remindersData } = await getUserReminders(user.id);
          if (remindersData) {
            setReminders(remindersData);
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchDashboardData();
    }
  }, [user]);

  const handleDonationAdded = (newDonation: Donation) => {
    setDonations(prev => [newDonation, ...prev]);
    
    // Update user profile
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        donation_count: userProfile.donation_count + 1,
        last_donation_date: newDonation.donation_date
      };
      setUserProfile(updatedProfile);
      
      // Update profile in database
      supabase
        .from('user_profiles')
        .update({
          donation_count: updatedProfile.donation_count,
          last_donation_date: updatedProfile.last_donation_date
        })
        .eq('id', user?.id)
        .then(({ error }) => {
          if (error) console.error('Error updating profile:', error);
        });
    }
  };

  const handleGoalAdded = (newGoal: DonationGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleGoalCompleted = (goalId: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, is_completed: true } : goal
      )
    );
  };

  const getNextDonationDate = (): Date | null => {
    if (!userProfile?.last_donation_date) return null;
    return calculateNextDonationDate(userProfile.last_donation_date);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading your dashboard...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Your Dashboard</h1>
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
            onClick={() => setActiveTab('impact')}
          >
            My Impact
          </button>
          <button 
            className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
          <button 
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            Reminders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            Community
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <PersonalOverview userProfile={userProfile} donations={donations} />
            
            <BloodSupplyStatus 
              region={userProfile?.region || null} 
              userBloodType={userProfile?.blood_type || null} 
            />
            
            <div className="dashboard-row">
              <div className="dashboard-card recent-donations">
                <h2>Recent Donations</h2>
                <DonationHistory 
                  donations={donations.slice(0, 3)} 
                  showViewAll={() => setActiveTab('donations')} 
                />
              </div>
              
              <div className="dashboard-card recent-achievements">
                <h2>Recent Achievements</h2>
                <AchievementsSection 
                  achievements={achievements.slice(0, 3)} 
                  showViewAll={() => setActiveTab('achievements')} 
                  compact={true}
                />
              </div>
            </div>

            <div className="dashboard-row">
              <div className="dashboard-card active-goals">
                <h2>Active Goals</h2>
                <GoalTracker 
                  goals={goals.filter(g => !g.is_completed).slice(0, 2)} 
                  showViewAll={() => setActiveTab('goals')} 
                  compact={true}
                  onGoalCompleted={handleGoalCompleted} 
                  currentDonationCount={userProfile?.donation_count || 0}
                />
              </div>
              
              <div className="dashboard-card upcoming-reminders">
                <h2>Upcoming Reminders</h2>
                <RemindersSection 
                  reminders={reminders.filter(r => !r.is_read).slice(0, 3)} 
                  showViewAll={() => setActiveTab('reminders')} 
                  compact={true}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="dashboard-donations">
            <div className="dashboard-row">
              <div className="dashboard-card">
                <h2>Add New Donation</h2>
                <DonationForm onDonationAdded={handleDonationAdded} userId={user?.id || ''} />
              </div>
            </div>
            <div className="dashboard-row">
              <div className="dashboard-card full-width">
                <h2>Donation History</h2>
                <DonationHistory donations={donations} showViewAll={null} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="dashboard-appointments">
            <AppointmentManagement userId={userProfile?.id || ''} />
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="dashboard-impact">
            <ImpactTracking userId={userProfile?.id || ''} donations={donations} />
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="dashboard-goals">
            <div className="dashboard-row">
              <div className="dashboard-card full-width">
                <h2>Your Donation Goals</h2>
                <GoalTracker 
                  goals={goals} 
                  showViewAll={null} 
                  compact={false}
                  onGoalCompleted={handleGoalCompleted} 
                  currentDonationCount={userProfile?.donation_count || 0}
                  onGoalAdded={handleGoalAdded}
                  userId={user?.id || ''}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="dashboard-achievements">
            <div className="dashboard-row">
              <div className="dashboard-card full-width">
                <h2>Your Achievements</h2>
                <AchievementsSection 
                  achievements={achievements} 
                  showViewAll={null} 
                  compact={false}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="dashboard-reminders">
            <div className="dashboard-row">
              <div className="dashboard-card full-width">
                <h2>Your Donation Reminders</h2>
                <RemindersSection 
                  reminders={reminders} 
                  showViewAll={null} 
                  compact={false}
                  userId={user?.id || ''}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="community-tab">
            <h2>Community</h2>
            <p className="tab-description">
              Connect with other donors, share your achievements, and see how you rank among other donors.
            </p>
            
            <div className="community-sections">
              <SocialSharing 
                donationCount={userProfile?.donation_count || 0}
                lastDonationDate={userProfile?.last_donation_date || null}
                bloodType={userProfile?.blood_type || null}
              />
              
              <Leaderboard userRegion={userProfile?.region || null} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 