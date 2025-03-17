import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (error) throw error;
        
        setStats(data);
      } catch (error) {
        setError('שגיאה בטעינת הסטטיסטיקות');
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'אין נתונים';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) return <div className="loading">טוען סטטיסטיקות...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!stats) return <div className="no-stats">אין נתונים סטטיסטיים להצגה</div>;

  return (
    <div className="user-stats-container">
      <h2>הסטטיסטיקות שלי</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon donation-icon"></div>
          <div className="stat-content">
            <h3>סך תרומות</h3>
            <p className="stat-value">{stats.total_donations}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon calendar-icon"></div>
          <div className="stat-content">
            <h3>תרומה אחרונה</h3>
            <p className="stat-value">{formatDate(stats.last_donation_date)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon streak-icon"></div>
          <div className="stat-content">
            <h3>רצף תרומות</h3>
            <p className="stat-value">{stats.streak}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon blood-icon"></div>
          <div className="stat-content">
            <h3>סוג דם</h3>
            <p className="stat-value">{stats.blood_type}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon rank-icon"></div>
          <div className="stat-content">
            <h3>דירוג</h3>
            <p className="stat-value">{stats.rank}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon points-icon"></div>
          <div className="stat-content">
            <h3>נקודות</h3>
            <p className="stat-value">{stats.points}</p>
          </div>
        </div>
      </div>
      
      <div className="stats-info">
        <h3>איך לשפר את הסטטיסטיקות שלך?</h3>
        <ul>
          <li>תרום דם באופן קבוע כדי להגדיל את הרצף שלך</li>
          <li>השלם יעדים כדי לצבור נקודות</li>
          <li>שתף את החוויה שלך בקהילה כדי לעודד אחרים</li>
        </ul>
      </div>
    </div>
  );
};

export default UserStats; 