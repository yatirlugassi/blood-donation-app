import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import ProfileForm from './ProfileForm';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      setProfile(profileData || null);
      
      // Fetch user's donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select(`
          id,
          donation_date,
          amount_ml,
          blood_type,
          donation_locations(name)
        `)
        .eq('user_id', user.id)
        .order('donation_date', { ascending: false })
        .limit(5);
        
      if (donationsError) throw donationsError;
      
      setDonations(donationsData || []);
      
      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }
      
      setStats(statsData || null);
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('שגיאה בטעינת נתוני משתמש');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    // Refresh all user data to ensure consistency
    fetchUserData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return <div className="loading">טוען פרופיל משתמש...</div>;
  }

  if (isEditing) {
    return <ProfileForm onSuccess={handleProfileUpdate} />;
  }

  return (
    <div className="user-profile-container">
      <h2>פרופיל משתמש</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-header">
        <div className="profile-info">
          <h3>{profile ? `${profile.first_name} ${profile.last_name}` : user.email}</h3>
          {profile && profile.blood_type && (
            <div className="blood-type-badge">
              {profile.blood_type}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsEditing(true)}
          className="secondary-button"
        >
          ערוך פרופיל
        </button>
      </div>
      
      {!profile && (
        <div className="profile-incomplete">
          <p>הפרופיל שלך אינו מלא. אנא השלם את הפרטים כדי להשתמש בכל תכונות המערכת.</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="primary-button"
          >
            השלם פרופיל
          </button>
        </div>
      )}
      
      {profile && (
        <div className="profile-details">
          <div className="profile-section">
            <h4>פרטים אישיים</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">אימייל:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              
              {profile.birth_date && (
                <div className="detail-item">
                  <span className="detail-label">תאריך לידה:</span>
                  <span className="detail-value">{formatDate(profile.birth_date)}</span>
                </div>
              )}
              
              {profile.phone && (
                <div className="detail-item">
                  <span className="detail-label">טלפון:</span>
                  <span className="detail-value">{profile.phone}</span>
                </div>
              )}
              
              {(profile.address || profile.city) && (
                <div className="detail-item">
                  <span className="detail-label">כתובת:</span>
                  <span className="detail-value">
                    {profile.address}{profile.address && profile.city ? ', ' : ''}{profile.city}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {profile.emergency_contact_name && (
            <div className="profile-section">
              <h4>איש קשר לחירום</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">שם:</span>
                  <span className="detail-value">{profile.emergency_contact_name}</span>
                </div>
                
                {profile.emergency_contact_phone && (
                  <div className="detail-item">
                    <span className="detail-label">טלפון:</span>
                    <span className="detail-value">{profile.emergency_contact_phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {profile.medical_conditions && (
            <div className="profile-section">
              <h4>מידע רפואי</h4>
              <p>{profile.medical_conditions}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="profile-section">
        <h4>סטטיסטיקות</h4>
        
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total_donations || 0}</div>
              <div className="stat-label">תרומות סה"כ</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.total_amount_ml ? `${stats.total_amount_ml} מ"ל` : '0 מ"ל'}</div>
              <div className="stat-label">סה"כ דם שנתרם</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.donation_streak || 0}</div>
              <div className="stat-label">רצף תרומות</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.rank || 'מתחיל'}</div>
              <div className="stat-label">דרגה</div>
            </div>
          </div>
        ) : (
          <p>אין נתונים סטטיסטיים זמינים. התחל לתרום דם כדי לצבור סטטיסטיקות!</p>
        )}
      </div>
      
      <div className="profile-section">
        <h4>תרומות אחרונות</h4>
        
        {donations.length > 0 ? (
          <div className="donations-list">
            {donations.map(donation => (
              <div key={donation.id} className="donation-item">
                <div className="donation-date">{formatDate(donation.donation_date)}</div>
                <div className="donation-details">
                  <div className="donation-location">{donation.donation_locations?.name || 'מיקום לא ידוע'}</div>
                  <div className="donation-type">{donation.blood_type || 'סוג דם לא ידוע'}</div>
                  <div className="donation-amount">{donation.amount_ml} מ"ל</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>אין תרומות להצגה. הוסף את התרומה הראשונה שלך!</p>
        )}
        
        <div className="profile-actions">
          <button className="primary-button">הוסף תרומה חדשה</button>
          {donations.length > 0 && (
            <button className="text-button">צפה בכל התרומות</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 