import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  blood_type: string | null;
  donation_count: number;
  last_donation_date: string | null;
}

interface RegionalDataUpdate {
  region: string;
  a_positive: number;
  a_negative: number;
  b_positive: number;
  b_negative: number;
  ab_positive: number;
  ab_negative: number;
  o_positive: number;
  o_negative: number;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalDataUpdate | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Check if user is an admin based on email domain
  const isAdmin = user?.email?.endsWith('@admin.blooddonationawareness.org') || false;

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, loading, navigate, isAdmin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, these would be actual API calls to Supabase
        // For demo purposes, we're using mock data
        
        // Mock users data
        const mockUsers: User[] = [
          { 
            id: '1', 
            email: 'user1@example.com', 
            blood_type: 'A+', 
            donation_count: 3, 
            last_donation_date: '2023-01-15' 
          },
          { 
            id: '2', 
            email: 'user2@example.com', 
            blood_type: 'O-', 
            donation_count: 5, 
            last_donation_date: '2023-02-22' 
          },
          { 
            id: '3', 
            email: 'user3@example.com', 
            blood_type: 'B+', 
            donation_count: 0, 
            last_donation_date: null 
          },
          { 
            id: '4', 
            email: 'user4@example.com', 
            blood_type: 'AB+', 
            donation_count: 2, 
            last_donation_date: '2023-03-10' 
          },
          { 
            id: '5', 
            email: 'user5@example.com', 
            blood_type: null, 
            donation_count: 0, 
            last_donation_date: null 
          },
        ];
        
        setUsers(mockUsers);
        
        // Mock regional data for Israel
        setRegionalData({
          region: 'Israel',
          a_positive: 34.0,
          a_negative: 4.0,
          b_positive: 17.0,
          b_negative: 2.0,
          ab_positive: 7.0,
          ab_negative: 1.0,
          o_positive: 32.0,
          o_negative: 3.0
        });
        
        setSelectedRegion('Israel');
        
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);
  
  const handleUpdateRegionalData = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would update the data in Supabase
    setSuccessMessage('Regional data updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  const handleInputChange = (field: keyof RegionalDataUpdate, value: string) => {
    if (regionalData) {
      setRegionalData({
        ...regionalData,
        [field]: parseFloat(value) || 0
      });
    }
  };
  
  if (loading) {
    return <div>Loading admin panel...</div>;
  }
  
  if (!user || !isAdmin) {
    return <div>Access denied. This page is only available to administrators.</div>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <section className="admin-section">
        <h3>User Management</h3>
        <p>Total users: {users.length}</p>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Blood Type</th>
              <th>Donations</th>
              <th>Last Donation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.blood_type || 'Not set'}</td>
                <td>{user.donation_count}</td>
                <td>{user.last_donation_date ? new Date(user.last_donation_date).toLocaleDateString() : 'Never'}</td>
                <td>
                  <button className="admin-button">Edit</button>
                  <button className="admin-button delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="admin-section">
        <h3>Regional Data Management</h3>
        
        <div className="region-selector">
          <label htmlFor="region-select">Select Region:</label>
          <select 
            id="region-select" 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="Israel">Israel</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="India">India</option>
          </select>
        </div>
        
        {regionalData && (
          <form onSubmit={handleUpdateRegionalData} className="regional-data-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="a_positive">A+:</label>
                <input 
                  type="number" 
                  id="a_positive" 
                  value={regionalData.a_positive}
                  onChange={(e) => handleInputChange('a_positive', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="a_negative">A-:</label>
                <input 
                  type="number" 
                  id="a_negative" 
                  value={regionalData.a_negative}
                  onChange={(e) => handleInputChange('a_negative', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="b_positive">B+:</label>
                <input 
                  type="number" 
                  id="b_positive" 
                  value={regionalData.b_positive}
                  onChange={(e) => handleInputChange('b_positive', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="b_negative">B-:</label>
                <input 
                  type="number" 
                  id="b_negative" 
                  value={regionalData.b_negative}
                  onChange={(e) => handleInputChange('b_negative', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ab_positive">AB+:</label>
                <input 
                  type="number" 
                  id="ab_positive" 
                  value={regionalData.ab_positive}
                  onChange={(e) => handleInputChange('ab_positive', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ab_negative">AB-:</label>
                <input 
                  type="number" 
                  id="ab_negative" 
                  value={regionalData.ab_negative}
                  onChange={(e) => handleInputChange('ab_negative', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="o_positive">O+:</label>
                <input 
                  type="number" 
                  id="o_positive" 
                  value={regionalData.o_positive}
                  onChange={(e) => handleInputChange('o_positive', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="o_negative">O-:</label>
                <input 
                  type="number" 
                  id="o_negative" 
                  value={regionalData.o_negative}
                  onChange={(e) => handleInputChange('o_negative', e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <button type="submit" className="admin-button">Update Regional Data</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default AdminPanel; 