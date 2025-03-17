import React, { useState, useEffect } from 'react';
import { getRegionalData, RegionalData } from '../services/supabaseClient';

const RegionalDistribution: React.FC = () => {
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegionalData = async () => {
      try {
        setLoading(true);
        console.log('Fetching regional data...');
        const { data, error } = await getRegionalData();
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Regional data received:', data);
        
        if (!data || data.length === 0) {
          throw new Error('No regional data available');
        }
        
        setRegionalData(data);
        setSelectedRegion(data[0].region);
      } catch (err: any) {
        console.error('Error fetching regional data:', err);
        setError('Failed to load regional blood type distribution data. Please make sure your Supabase database is properly set up with the regional_blood_data table.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegionalData();
  }, []);

  // Get the data for the currently selected region
  const getSelectedRegionData = () => {
    return regionalData.find(region => region.region === selectedRegion);
  };

  // Format percentage for display
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Get blood type data in a format suitable for display
  const getBloodTypeData = () => {
    const selectedData = getSelectedRegionData();
    if (!selectedData) return [];

    return [
      { type: 'A+', percentage: selectedData.a_positive },
      { type: 'A-', percentage: selectedData.a_negative },
      { type: 'B+', percentage: selectedData.b_positive },
      { type: 'B-', percentage: selectedData.b_negative },
      { type: 'AB+', percentage: selectedData.ab_positive },
      { type: 'AB-', percentage: selectedData.ab_negative },
      { type: 'O+', percentage: selectedData.o_positive },
      { type: 'O-', percentage: selectedData.o_negative }
    ].sort((a, b) => b.percentage - a.percentage); // Sort by percentage (highest first)
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading regional data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="error-icon">!</div>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedData = getSelectedRegionData();
  const bloodTypeData = getBloodTypeData();

  return (
    <div className="container">
      <div className="regional-distribution">
        <div className="page-header">
          <h1>Regional Blood Type Distribution</h1>
          <p>Explore blood type distribution across different regions</p>
        </div>
        
        <div className="region-selector">
          <label htmlFor="region">Select Region:</label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            {regionalData.map((region) => (
              <option key={region.id} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
        </div>

        {selectedData && (
          <div className="region-data">
            <div className="region-header">
              <h2>{selectedData.region}</h2>
              <p className="population">Population: {selectedData.population.toLocaleString()}</p>
              <p className="updated-date">Last Updated: {new Date(selectedData.updated_at).toLocaleDateString()}</p>
            </div>
            
            <div className="blood-type-distribution">
              <h3>Blood Type Distribution</h3>
              <div className="distribution-chart">
                {bloodTypeData.map((bloodType) => (
                  <div key={bloodType.type} className="chart-bar">
                    <div 
                      className="bar" 
                      style={{ width: `${bloodType.percentage * 3}px` }}
                      title={`${bloodType.type}: ${formatPercentage(bloodType.percentage)}`}
                    ></div>
                    <div className="bar-label">
                      <span className="type">{bloodType.type}</span>
                      <span className="percentage">{formatPercentage(bloodType.percentage)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="distribution-info">
              <h3>Important Notes</h3>
              <ul>
                <li>Blood type distribution varies by ethnicity and region.</li>
                <li>O+ is typically the most common blood type in most populations.</li>
                <li>AB- is typically the rarest blood type in most populations.</li>
                <li>Understanding the distribution helps blood banks maintain appropriate supplies.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionalDistribution; 