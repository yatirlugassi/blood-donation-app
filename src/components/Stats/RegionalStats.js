import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const RegionalStats = () => {
  const [regionalData, setRegionalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegionalStats = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('regional_stats')
          .select('*');
          
        if (error) throw error;
        
        setRegionalData(data || []);
      } catch (error) {
        setError('שגיאה בטעינת נתונים אזוריים');
        console.error('Error fetching regional stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionalStats();
  }, []);

  const getShortageClass = (level) => {
    switch (level) {
      case 'גבוה':
        return 'high-shortage';
      case 'בינוני':
        return 'medium-shortage';
      case 'נמוך':
        return 'low-shortage';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">טוען נתונים אזוריים...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (regionalData.length === 0) return <div className="no-data">אין נתונים אזוריים להצגה</div>;

  return (
    <div className="regional-stats-container">
      <h2>נתונים אזוריים</h2>
      
      <div className="regional-stats-info">
        <p>הנתונים הבאים מציגים את מצב תרומות הדם באזורים שונים בארץ, כולל סוגי דם נדרשים ורמת המחסור.</p>
      </div>
      
      <div className="regional-stats-table">
        <table>
          <thead>
            <tr>
              <th>אזור</th>
              <th>סך תרומות</th>
              <th>סוג דם נדרש</th>
              <th>רמת מחסור</th>
            </tr>
          </thead>
          <tbody>
            {regionalData.map((region, index) => (
              <tr key={index}>
                <td>{region.region}</td>
                <td>{region.total_donations}</td>
                <td className="blood-type">{region.needed_type}</td>
                <td>
                  <span className={`shortage-level ${getShortageClass(region.shortage_level)}`}>
                    {region.shortage_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="regional-stats-legend">
        <h3>מקרא רמות מחסור:</h3>
        <ul>
          <li><span className="shortage-indicator high-shortage"></span> גבוה - נדרשות תרומות בדחיפות</li>
          <li><span className="shortage-indicator medium-shortage"></span> בינוני - נדרשות תרומות באופן קבוע</li>
          <li><span className="shortage-indicator low-shortage"></span> נמוך - מלאי תקין</li>
        </ul>
      </div>
      
      <div className="regional-stats-cta">
        <p>עזור לנו לשמור על מלאי דם מספק בכל האזורים!</p>
        <button className="donate-button">מצא נקודת תרומה קרובה</button>
      </div>
    </div>
  );
};

export default RegionalStats; 