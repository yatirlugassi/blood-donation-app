import React, { useState } from 'react';

interface DonationCenter {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  website: string;
}

const DonationCenters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Mock data for donation centers
  const centers: DonationCenter[] = [
    {
      id: 1,
      name: "Red Cross Blood Donation Center",
      address: "123 Main Street",
      city: "Boston",
      state: "MA",
      zip: "02108",
      phone: "(617) 555-1234",
      hours: "Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm",
      website: "https://www.redcross.org"
    },
    {
      id: 2,
      name: "Community Blood Center",
      address: "456 Oak Avenue",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      phone: "(312) 555-6789",
      hours: "Mon-Fri: 7am-7pm, Sat: 8am-3pm, Sun: Closed",
      website: "https://www.communityblood.org"
    },
    {
      id: 3,
      name: "LifeSource Blood Center",
      address: "789 Pine Boulevard",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "(212) 555-4321",
      hours: "Mon-Sun: 8am-8pm",
      website: "https://www.lifesource.org"
    },
    {
      id: 4,
      name: "Vitalant Blood Donation",
      address: "321 Cedar Lane",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      phone: "(415) 555-8765",
      hours: "Mon-Fri: 9am-7pm, Sat-Sun: 10am-4pm",
      website: "https://www.vitalant.org"
    },
    {
      id: 5,
      name: "OneBlood Donation Center",
      address: "654 Maple Road",
      city: "Miami",
      state: "FL",
      zip: "33101",
      phone: "(305) 555-9876",
      hours: "Mon-Fri: 8am-6pm, Sat: 9am-3pm, Sun: Closed",
      website: "https://www.oneblood.org"
    },
    {
      id: 6,
      name: "BloodCenter of Wisconsin",
      address: "987 Birch Street",
      city: "Milwaukee",
      state: "WI",
      zip: "53202",
      phone: "(414) 555-3456",
      hours: "Mon-Fri: 7:30am-7pm, Sat-Sun: 8am-2pm",
      website: "https://www.bcw.edu"
    },
    {
      id: 7,
      name: "Carter BloodCare",
      address: "159 Elm Court",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      phone: "(214) 555-7890",
      hours: "Mon-Fri: 8am-8pm, Sat: 9am-4pm, Sun: 10am-2pm",
      website: "https://www.carterbloodcare.org"
    },
    {
      id: 8,
      name: "Blood Assurance",
      address: "753 Spruce Drive",
      city: "Atlanta",
      state: "GA",
      zip: "30301",
      phone: "(404) 555-2468",
      hours: "Mon-Fri: 9am-6pm, Sat: 9am-1pm, Sun: Closed",
      website: "https://www.bloodassurance.org"
    }
  ];

  // List of US states for the filter dropdown
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Filter centers based on search term and selected state
  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = selectedState === '' || center.state === selectedState;
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1>Find Blood Donation Centers</h1>
        <p>Locate blood donation centers near you and help save lives in your community.</p>
      </div>

      <div className="search-container">
        <div className="search-filters">
          <div className="search-input">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by name, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-field"
            />
          </div>
          
          <div className="state-filter">
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="state-select"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="centers-list">
        {filteredCenters.length > 0 ? (
          filteredCenters.map(center => (
            <div key={center.id} className="center-card">
              <div className="center-info">
                <h3 className="center-name">{center.name}</h3>
                <div className="center-address">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{center.address}, {center.city}, {center.state} {center.zip}</p>
                </div>
                <div className="center-phone">
                  <i className="fas fa-phone"></i>
                  <p>{center.phone}</p>
                </div>
                <div className="center-hours">
                  <i className="fas fa-clock"></i>
                  <p>{center.hours}</p>
                </div>
              </div>
              <div className="center-actions">
                <a href={center.website} target="_blank" rel="noopener noreferrer" className="website-button">
                  <i className="fas fa-external-link-alt"></i> Visit Website
                </a>
                <a href={`https://maps.google.com/?q=${center.address},${center.city},${center.state},${center.zip}`} target="_blank" rel="noopener noreferrer" className="directions-button">
                  <i className="fas fa-directions"></i> Get Directions
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No donation centers found</h3>
            <p>Try adjusting your search criteria or selecting a different state.</p>
          </div>
        )}
      </div>

      <div className="centers-note">
        <p>
          <i className="fas fa-info-circle"></i> This is a sample list of donation centers. 
          For the most accurate and up-to-date information, please visit the 
          <a href="https://www.redcrossblood.org/give.html/find-drive" target="_blank" rel="noopener noreferrer"> American Red Cross website</a> or 
          <a href="https://www.aabb.org/for-donors-patients/give-blood" target="_blank" rel="noopener noreferrer"> AABB</a>.
        </p>
      </div>
    </div>
  );
};

export default DonationCenters; 