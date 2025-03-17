import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const LeaderboardList = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('donations_count', { ascending: false });
          
        if (error) throw error;
        
        setLeaderboard(data || []);
      } catch (error) {
        setError('שגיאה בטעינת טבלת המובילים');
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankClass = (rank) => {
    switch (rank) {
      case 'מתרים מצטיין':
        return 'rank-excellent';
      case 'מתרים קבוע':
        return 'rank-regular';
      case 'מתרים מתחיל':
        return 'rank-beginner';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">טוען טבלת מובילים...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (leaderboard.length === 0) return <div className="no-data">אין נתונים להצגה</div>;

  return (
    <div className="leaderboard-container">
      <h2>טבלת המובילים</h2>
      
      <div className="leaderboard-info">
        <p>המתרימים המובילים במערכת, מדורגים לפי מספר תרומות ונקודות.</p>
      </div>
      
      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div 
            key={user.user_id} 
            className={`leaderboard-item ${index < 3 ? 'top-rank' : ''}`}
          >
            <div className="rank-number">{index + 1}</div>
            
            <div className="user-info">
              <div className="user-avatar"></div>
              <div className="user-details">
                <h3 className="user-name">{user.user_name}</h3>
                <span className={`user-rank ${getRankClass(user.rank)}`}>{user.rank}</span>
              </div>
            </div>
            
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-label">תרומות</span>
                <span className="stat-value">{user.donations_count}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">נקודות</span>
                <span className="stat-value">{user.points}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="leaderboard-footer">
        <h3>איך להתקדם בדירוג?</h3>
        <ul>
          <li>תרום דם באופן קבוע</li>
          <li>השלם יעדים אישיים</li>
          <li>השתתף בפעילויות קהילתיות</li>
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardList; 