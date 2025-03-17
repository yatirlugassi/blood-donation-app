import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BloodType, getBloodTypes, getCompatibleDonors, getCompatibleRecipients } from '../services/supabaseClient';

const Dashboard: React.FC = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const [bloodTypes, setBloodTypes] = useState<BloodType[]>([]);
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [lastDonationDate, setLastDonationDate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compatibleDonors, setCompatibleDonors] = useState<string[]>([]);
  const [compatibleRecipients, setCompatibleRecipients] = useState<string[]>([]);
  
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch blood types
  useEffect(() => {
    const fetchBloodTypes = async () => {
      try {
        const { data, error } = await getBloodTypes();
        if (error) throw error;
        if (data) setBloodTypes(data);
      } catch (err: any) {
        console.error('Error fetching blood types:', err.message);
        setError('Failed to load blood types');
      }
    };

    fetchBloodTypes();
  }, []);

  // Set initial form values from profile
  useEffect(() => {
    if (profile) {
      setSelectedBloodType(profile.blood_type);
      setSelectedRegion(profile.region);
      setLastDonationDate(profile.last_donation_date);
    }
  }, [profile]);

  // Fetch compatibility data when blood type is selected
  useEffect(() => {
    const fetchCompatibility = async () => {
      if (!selectedBloodType) {
        setCompatibleDonors([]);
        setCompatibleRecipients([]);
        return;
      }

      try {
        const [donorsResponse, recipientsResponse] = await Promise.all([
          getCompatibleDonors(selectedBloodType),
          getCompatibleRecipients(selectedBloodType)
        ]);

        if (donorsResponse.error) throw donorsResponse.error;
        if (recipientsResponse.error) throw recipientsResponse.error;

        setCompatibleDonors(donorsResponse.data || []);
        setCompatibleRecipients(recipientsResponse.data || []);
      } catch (err: any) {
        console.error('Error fetching compatibility data:', err.message);
        setError('Failed to load compatibility data');
      }
    };

    fetchCompatibility();
  }, [selectedBloodType]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      const { error } = await updateProfile({
        blood_type: selectedBloodType,
        region: selectedRegion,
        last_donation_date: lastDonationDate
      });

      if (error) throw error;
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err.message);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  // If user is logged in but profile is still loading or not found
  if (!profile) {
    return <div className="loading">Loading your profile data...</div>;
  }

  const regions = ['North', 'South', 'Central', 'East', 'West'];

  return (
    <div className="dashboard-container">
      <h1>Your Dashboard</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Your Profile</h2>
          {!isEditing ? (
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div className="button-group">
              <button 
                className="save-button"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedBloodType(profile.blood_type);
                  setSelectedRegion(profile.region);
                  setLastDonationDate(profile.last_donation_date);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-details">
          <div className="profile-row">
            <div className="profile-label">Email:</div>
            <div className="profile-value">{user.email}</div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Blood Type:</div>
            <div className="profile-value">
              {isEditing ? (
                <select
                  value={selectedBloodType || ''}
                  onChange={(e) => setSelectedBloodType(e.target.value || null)}
                  disabled={isSaving}
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map((bloodType) => (
                    <option key={bloodType.id} value={bloodType.type}>
                      {bloodType.type}
                    </option>
                  ))}
                </select>
              ) : (
                profile.blood_type || 'Not set'
              )}
            </div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Region:</div>
            <div className="profile-value">
              {isEditing ? (
                <select
                  value={selectedRegion || ''}
                  onChange={(e) => setSelectedRegion(e.target.value || null)}
                  disabled={isSaving}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              ) : (
                profile.region || 'Not set'
              )}
            </div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Last Donation:</div>
            <div className="profile-value">
              {isEditing ? (
                <input
                  type="date"
                  value={lastDonationDate || ''}
                  onChange={(e) => setLastDonationDate(e.target.value || null)}
                  disabled={isSaving}
                />
              ) : (
                profile.last_donation_date 
                  ? new Date(profile.last_donation_date).toLocaleDateString() 
                  : 'Not recorded'
              )}
            </div>
          </div>
          
          <div className="profile-row">
            <div className="profile-label">Donation Count:</div>
            <div className="profile-value">{profile.donation_count || 0}</div>
          </div>
        </div>
      </div>
      
      {selectedBloodType && (
        <div className="dashboard-card">
          <h2>Blood Type Compatibility</h2>
          
          <div className="compatibility-container">
            <div className="compatibility-section">
              <h3>You can receive from:</h3>
              {compatibleDonors.length > 0 ? (
                <ul className="compatibility-list">
                  {compatibleDonors.map((type) => (
                    <li key={type} className="blood-type-badge">
                      {type}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No compatible donors found</p>
              )}
            </div>
            
            <div className="compatibility-divider"></div>
            
            <div className="compatibility-section">
              <h3>You can donate to:</h3>
              {compatibleRecipients.length > 0 ? (
                <ul className="compatibility-list">
                  {compatibleRecipients.map((type) => (
                    <li key={type} className="blood-type-badge">
                      {type}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No compatible recipients found</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-card">
        <h2>Your Donation Journey</h2>
        
        <div className="donation-stats">
          <div className="stat-box">
            <div className="stat-value">{profile.donation_count || 0}</div>
            <div className="stat-label">Total Donations</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">
              {profile.donation_count ? (profile.donation_count * 3).toFixed(0) : 0}
            </div>
            <div className="stat-label">Lives Impacted</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">
              {profile.last_donation_date ? (
                Math.max(
                  0,
                  Math.floor(
                    (56 - Math.min(
                      56, 
                      Math.floor((Date.now() - new Date(profile.last_donation_date).getTime()) / (1000 * 60 * 60 * 24))
                    )) / 7
                  )
                )
              ) : (
                'N/A'
              )}
            </div>
            <div className="stat-label">Weeks Until Next Eligible</div>
          </div>
        </div>
        
        <div className="donation-cta">
          <h3>Ready to make a difference?</h3>
          <p>Donating blood takes just an hour of your time but can save up to 3 lives.</p>
          <button className="primary-button" onClick={() => navigate('/donate')}>
            Find Donation Centers
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 