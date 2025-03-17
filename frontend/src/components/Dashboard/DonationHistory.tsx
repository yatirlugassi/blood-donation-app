import React from 'react';
import { Donation } from '../../services/dashboardService';

interface DonationHistoryProps {
  donations: Donation[];
  showViewAll: (() => void) | null;
}

const DonationHistory: React.FC<DonationHistoryProps> = ({ donations, showViewAll }) => {
  if (!donations || donations.length === 0) {
    return (
      <div className="no-donations">
        <p>You haven't recorded any donations yet.</p>
        <p>When you donate blood, add it here to track your contribution.</p>
      </div>
    );
  }

  return (
    <div className="donation-history">
      <table className="donations-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Center</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="donation-row">
              <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
              <td>{donation.donation_center}</td>
              <td>{donation.donation_type}</td>
              <td>{donation.blood_amount_ml} ml</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showViewAll && donations.length > 0 && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={showViewAll}>
            View All Donations
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationHistory; 