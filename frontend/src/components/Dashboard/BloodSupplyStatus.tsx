import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDroplet, 
  faLocationDot, 
  faCircleExclamation,
  faArrowTrendUp,
  faArrowTrendDown
} from '@fortawesome/free-solid-svg-icons';

// Mock data - In a real app, this would come from an API
interface BloodTypeSupply {
  type: string;
  level: 'critical' | 'low' | 'moderate' | 'optimal';
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface BloodSupplyStatusProps {
  region: string | null;
  userBloodType: string | null;
}

const BloodSupplyStatus: React.FC<BloodSupplyStatusProps> = ({ region, userBloodType }) => {
  const [bloodSupply, setBloodSupply] = useState<BloodTypeSupply[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    // Simulate API call to get blood supply
    const fetchBloodSupply = async () => {
      setLoading(true);
      
      // Mock data - In a real app, this would be fetched from a backend API
      // The data would be specific to the user's region
      setTimeout(() => {
        const mockData: BloodTypeSupply[] = [
          { type: 'A+', level: 'moderate', percentage: 65, trend: 'stable' },
          { type: 'A-', level: 'low', percentage: 30, trend: 'down' },
          { type: 'B+', level: 'optimal', percentage: 80, trend: 'up' },
          { type: 'B-', level: 'critical', percentage: 15, trend: 'down' },
          { type: 'AB+', level: 'optimal', percentage: 75, trend: 'stable' },
          { type: 'AB-', level: 'low', percentage: 35, trend: 'stable' },
          { type: 'O+', level: 'moderate', percentage: 50, trend: 'down' },
          { type: 'O-', level: 'critical', percentage: 10, trend: 'down' },
        ];
        
        setBloodSupply(mockData);
        setLastUpdated(new Date());
        setLoading(false);
      }, 1000);
    };
    
    fetchBloodSupply();
  }, [region]);
  
  // Find the user's blood type supply info
  const userBloodTypeSupply = userBloodType 
    ? bloodSupply.find(supply => supply.type === userBloodType) 
    : null;
  
  // Find critical blood types
  const criticalBloodTypes = bloodSupply.filter(supply => supply.level === 'critical');
  
  // Convert level to color
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'critical': return '#d32f2f';
      case 'low': return '#ff9800';
      case 'moderate': return '#ffc107';
      case 'optimal': return '#4caf50';
      default: return '#757575';
    }
  };
  
  // Get level text
  const getLevelText = (level: string): string => {
    switch (level) {
      case 'critical': return 'Critical Shortage';
      case 'low': return 'Low Supply';
      case 'moderate': return 'Moderate Supply';
      case 'optimal': return 'Optimal Supply';
      default: return 'Unknown';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <FontAwesomeIcon icon={faArrowTrendUp} className="trend-icon up" />;
      case 'down': return <FontAwesomeIcon icon={faArrowTrendDown} className="trend-icon down" />;
      default: return null;
    }
  };
  
  return (
    <div className="blood-supply-status">
      <div className="supply-header">
        <h2>Blood Supply Status</h2>
        <div className="region-info">
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{region || 'National'}</span>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-supply">
          <div className="spinner"></div>
          <p>Loading blood supply data...</p>
        </div>
      ) : (
        <>
          {/* Critical Needs Alert */}
          {criticalBloodTypes.length > 0 && (
            <div className="critical-needs-alert">
              <div className="alert-icon">
                <FontAwesomeIcon icon={faCircleExclamation} />
              </div>
              <div className="alert-content">
                <h3>Critical Shortage Alert</h3>
                <p>
                  <strong>Urgent need for: </strong>
                  {criticalBloodTypes.map(type => type.type).join(', ')}
                </p>
                {userBloodTypeSupply && userBloodTypeSupply.level === 'critical' && (
                  <div className="your-type-critical">
                    Your blood type is critically needed right now!
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* User's Blood Type Supply */}
          {userBloodTypeSupply && (
            <div className="your-blood-supply">
              <h3>Your Blood Type Supply</h3>
              <div className="blood-type-card large">
                <div 
                  className={`blood-type-icon ${userBloodType?.toLowerCase().replace('+', '-positive').replace('-', '-negative')}`}
                >
                  <FontAwesomeIcon icon={faDroplet} />
                  <span>{userBloodType}</span>
                </div>
                <div className="supply-info">
                  <div className="supply-level">
                    <span className="level-text" style={{ color: getLevelColor(userBloodTypeSupply.level) }}>
                      {getLevelText(userBloodTypeSupply.level)}
                    </span>
                    {getTrendIcon(userBloodTypeSupply.trend)}
                  </div>
                  <div className="supply-bar-container">
                    <div 
                      className="supply-bar" 
                      style={{ 
                        width: `${userBloodTypeSupply.percentage}%`,
                        backgroundColor: getLevelColor(userBloodTypeSupply.level)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* All Blood Types Supply */}
          <div className="all-blood-supply">
            <h3>Current Blood Supply Levels</h3>
            <div className="blood-type-grid">
              {bloodSupply.map((supply) => (
                <div 
                  key={supply.type} 
                  className={`blood-type-card ${supply.type === userBloodType ? 'active' : ''}`}
                >
                  <div className="blood-card-header">
                    <span className="type">{supply.type}</span>
                    {getTrendIcon(supply.trend)}
                  </div>
                  <div className="supply-bar-container">
                    <div 
                      className="supply-bar" 
                      style={{ 
                        width: `${supply.percentage}%`,
                        backgroundColor: getLevelColor(supply.level)
                      }}
                    ></div>
                  </div>
                  <div className="supply-percentage">
                    <span style={{ color: getLevelColor(supply.level) }}>
                      {supply.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="supply-footer">
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BloodSupplyStatus; 