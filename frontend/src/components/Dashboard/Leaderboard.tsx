import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  donation_count: number;
  region: string | null;
  blood_type: string | null;
  rank: number;
}

interface LeaderboardProps {
  userRegion: string | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userRegion }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'global' | 'regional'>('global');
  const [timeRange, setTimeRange] = useState<'all-time' | 'this-year' | 'this-month'>('all-time');

  useEffect(() => {
    fetchLeaderboardData();
  }, [filterType, timeRange, userRegion]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the query based on filter type and time range
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          donation_count,
          region,
          blood_type
        `)
        .order('donation_count', { ascending: false })
        .limit(10);
      
      // Apply regional filter if selected
      if (filterType === 'regional' && userRegion) {
        query = query.eq('region', userRegion);
      }
      
      // Apply time range filter (in a real implementation, this would filter donations by date)
      // For this example, we'll just use the donation_count
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Transform the data for display
        const leaderboard: LeaderboardEntry[] = await Promise.all(
          data.map(async (entry, index) => {
            // In a real implementation, you would fetch the username from auth.users
            // For this example, we'll generate a placeholder username
            const username = `Donor${entry.id.substring(0, 4)}`;
            
            return {
              user_id: entry.id,
              username,
              donation_count: entry.donation_count || 0,
              region: entry.region,
              blood_type: entry.blood_type,
              rank: index + 1
            };
          })
        );
        
        setLeaderboardData(leaderboard);
        
        // Find user's rank if they're in the leaderboard
        const userEntry = leaderboard.find(entry => entry.user_id === user?.id);
        if (userEntry) {
          setUserRank(userEntry.rank);
        } else {
          // If user is not in top 10, fetch their rank separately
          await fetchUserRank();
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    if (!user) return;
    
    try {
      // Get user's donation count
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('donation_count')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      if (userData) {
        // Count how many users have more donations
        const { count, error: countError } = await supabase
          .from('user_profiles')
          .select('id', { count: 'exact' })
          .gt('donation_count', userData.donation_count || 0);
        
        if (countError) throw countError;
        
        // User's rank is count + 1
        setUserRank((count || 0) + 1);
      }
    } catch (err) {
      console.error('Error fetching user rank:', err);
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h3>Donor Leaderboard</h3>
        
        <div className="leaderboard-filters">
          <div className="filter-group">
            <label>View:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'global' ? 'active' : ''}`}
                onClick={() => setFilterType('global')}
              >
                Global
              </button>
              <button 
                className={`filter-btn ${filterType === 'regional' ? 'active' : ''}`}
                onClick={() => setFilterType('regional')}
                disabled={!userRegion}
              >
                My Region
              </button>
            </div>
          </div>
          
          <div className="filter-group">
            <label>Time:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${timeRange === 'all-time' ? 'active' : ''}`}
                onClick={() => setTimeRange('all-time')}
              >
                All Time
              </button>
              <button 
                className={`filter-btn ${timeRange === 'this-year' ? 'active' : ''}`}
                onClick={() => setTimeRange('this-year')}
              >
                This Year
              </button>
              <button 
                className={`filter-btn ${timeRange === 'this-month' ? 'active' : ''}`}
                onClick={() => setTimeRange('this-month')}
              >
                This Month
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="leaderboard-loading">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="leaderboard-error">
          <p>{error}</p>
          <button onClick={fetchLeaderboardData}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="leaderboard-table">
            <div className="leaderboard-table-header">
              <div className="rank-col">Rank</div>
              <div className="donor-col">Donor</div>
              <div className="region-col">Region</div>
              <div className="blood-type-col">Blood Type</div>
              <div className="donations-col">Donations</div>
            </div>
            
            <div className="leaderboard-table-body">
              {leaderboardData.length > 0 ? (
                leaderboardData.map(entry => (
                  <div 
                    key={entry.user_id} 
                    className={`leaderboard-row ${entry.user_id === user?.id ? 'current-user' : ''}`}
                  >
                    <div className="rank-col">
                      {entry.rank <= 3 ? (
                        <span className={`rank-badge rank-${entry.rank}`}>
                          {entry.rank}
                        </span>
                      ) : (
                        entry.rank
                      )}
                    </div>
                    <div className="donor-col">{entry.username}</div>
                    <div className="region-col">{entry.region || 'Unknown'}</div>
                    <div className="blood-type-col">{entry.blood_type || 'Unknown'}</div>
                    <div className="donations-col">{entry.donation_count}</div>
                  </div>
                ))
              ) : (
                <div className="no-data-message">
                  No donors found for the selected filters.
                </div>
              )}
            </div>
          </div>
          
          {userRank && userRank > 10 && (
            <div className="user-rank-info">
              <p>Your current rank: <span className="user-rank">{userRank}</span></p>
              <p>Keep donating to climb the leaderboard!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard; 