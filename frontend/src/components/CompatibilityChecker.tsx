import React, { useState, useEffect } from 'react';
import { getBloodTypes, getBloodCompatibility, BloodType, BloodCompatibility } from '../services/supabaseClient';

const CompatibilityChecker: React.FC = () => {
  const [bloodTypes, setBloodTypes] = useState<BloodType[]>([]);
  const [compatibilityData, setCompatibilityData] = useState<BloodCompatibility[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching blood types and compatibility data...');
        const [bloodTypesResponse, compatibilityResponse] = await Promise.all([
          getBloodTypes(),
          getBloodCompatibility()
        ]);
        
        if (bloodTypesResponse.error) {
          console.error('Error fetching blood types:', bloodTypesResponse.error);
          throw bloodTypesResponse.error;
        }
        
        if (compatibilityResponse.error) {
          console.error('Error fetching compatibility data:', compatibilityResponse.error);
          throw compatibilityResponse.error;
        }
        
        console.log('Blood types data:', bloodTypesResponse.data);
        console.log('Compatibility data:', compatibilityResponse.data);
        
        if (!bloodTypesResponse.data || bloodTypesResponse.data.length === 0) {
          throw new Error('No blood types found in the database');
        }
        
        if (!compatibilityResponse.data || compatibilityResponse.data.length === 0) {
          throw new Error('No compatibility data found in the database');
        }
        
        setBloodTypes(bloodTypesResponse.data || []);
        setCompatibilityData(compatibilityResponse.data || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load blood type information: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCompatibleDonors = (recipientType: string) => {
    return compatibilityData
      .filter(item => item.recipient_type === recipientType && item.compatible)
      .map(item => item.donor_type);
  };

  const getCompatibleRecipients = (donorType: string) => {
    return compatibilityData
      .filter(item => item.donor_type === donorType && item.compatible)
      .map(item => item.recipient_type);
  };

  const renderBloodTypeCard = (type: string) => {
    const isCompatible = selectedType && (
      getCompatibleDonors(selectedType).includes(type) || 
      getCompatibleRecipients(selectedType).includes(type)
    );
    
    const isSelected = selectedType === type;
    
    return (
      <div 
        key={type} 
        className={`blood-type-card ${isSelected ? 'selected' : ''} ${isCompatible ? 'compatible' : ''}`}
        onClick={() => setSelectedType(type)}
      >
        <div className="blood-type-icon">{type}</div>
        <div className="blood-type-name">
          {bloodTypes.find(bt => bt.type === type)?.description || type}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading compatibility data...</p>
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

  return (
    <div className="container">
      <div className="compatibility-checker">
        <div className="page-header">
          <h1>Blood Type Compatibility Checker</h1>
          <p>Select your blood type to see who you can donate to and receive from</p>
        </div>
        
        <div className="blood-type-selector">
          <h2>Select Your Blood Type</h2>
          <div className="blood-type-grid">
            {bloodTypes.map((type) => renderBloodTypeCard(type.type))}
          </div>
        </div>

        {selectedType && (
          <div className="compatibility-results">
            <div className="compatibility-box donate-box">
              <h2>You can donate to:</h2>
              <div className="compatibility-list">
                {getCompatibleRecipients(selectedType).length > 0 ? (
                  getCompatibleRecipients(selectedType).map((type) => (
                    <div key={`recipient-${type}`} className="compatible-type">
                      <div className="blood-drop-icon"></div>
                      <span>{type}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-compatibility">No compatible recipients found</div>
                )}
              </div>
            </div>
            
            <div className="compatibility-box receive-box">
              <h2>You can receive from:</h2>
              <div className="compatibility-list">
                {getCompatibleDonors(selectedType).length > 0 ? (
                  getCompatibleDonors(selectedType).map((type) => (
                    <div key={`donor-${type}`} className="compatible-type">
                      <div className="blood-drop-icon"></div>
                      <span>{type}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-compatibility">No compatible donors found</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="compatibility-info">
          <h2>Understanding Blood Type Compatibility</h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>Why Compatibility Matters</h3>
              <p>
                Blood type compatibility is crucial for safe blood transfusions. 
                If you receive blood that's incompatible with your type, your immune system
                will attack the new blood cells, potentially causing a serious or even fatal
                reaction.
              </p>
            </div>
            
            <div className="info-card">
              <h3>Universal Donors & Recipients</h3>
              <p>
                Type O negative is known as the "universal donor" because it can generally
                be given to anyone. Type AB positive is the "universal recipient" because
                people with this type can receive blood from any type.
              </p>
            </div>
            
            <div className="info-card">
              <h3>Blood Type Distribution</h3>
              <p>
                Blood type distribution varies by region and ethnicity. In most populations,
                O positive is the most common blood type, while AB negative is the rarest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityChecker; 