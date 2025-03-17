import React from 'react';
import { UserAchievement } from '../../services/dashboardService';

interface AchievementsSectionProps {
  achievements: UserAchievement[];
  showViewAll: (() => void) | null;
  compact: boolean;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ 
  achievements, 
  showViewAll, 
  compact 
}) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="no-achievements">
        <p>You haven't earned any achievements yet.</p>
        <p>Donate blood to unlock achievements and track your contribution!</p>
      </div>
    );
  }

  return (
    <div className="achievements-section">
      <div className={`achievements-grid ${compact ? 'compact' : ''}`}>
        {achievements.map((userAchievement) => {
          const achievement = userAchievement.achievement;
          if (!achievement) return null;
          
          return (
            <div key={userAchievement.id} className="achievement-card">
              <div className="achievement-icon">
                {achievement.icon_url ? (
                  <img 
                    src={achievement.icon_url} 
                    alt={achievement.name} 
                    className="achievement-image"
                  />
                ) : (
                  <div className="default-achievement-icon">🏆</div>
                )}
              </div>
              <div className="achievement-info">
                <h3 className="achievement-name">{achievement.name}</h3>
                {!compact && (
                  <p className="achievement-description">{achievement.description}</p>
                )}
                <p className="achievement-date">
                  Earned on {new Date(userAchievement.earned_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {showViewAll && achievements.length > 0 && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={showViewAll}>
            View All Achievements
          </button>
        </div>
      )}
    </div>
  );
};

export default AchievementsSection; 