import React, { useState } from 'react';
import { Donation, addDonation } from '../../services/dashboardService';

interface DonationFormProps {
  userId: string;
  onDonationAdded: (donation: Donation) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ userId, onDonationAdded }) => {
  const [formData, setFormData] = useState({
    donation_date: new Date().toISOString().split('T')[0],
    donation_center: '',
    blood_amount_ml: 450, // Default for whole blood donation
    donation_type: 'Whole Blood',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'blood_amount_ml' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const donationData = {
        ...formData,
        user_id: userId
      };
      
      const { data, error } = await addDonation(donationData);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        onDonationAdded(data);
        setSuccess(true);
        // Reset form except date
        setFormData({
          donation_date: new Date().toISOString().split('T')[0],
          donation_center: '',
          blood_amount_ml: 450,
          donation_type: 'Whole Blood',
          notes: ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      {success && (
        <div className="success-message">
          Donation added successfully!
        </div>
      )}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="donation_date">Donation Date</label>
          <input
            type="date"
            id="donation_date"
            name="donation_date"
            value={formData.donation_date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="donation_center">Donation Center</label>
          <input
            type="text"
            id="donation_center"
            name="donation_center"
            value={formData.donation_center}
            onChange={handleChange}
            placeholder="Red Cross Center"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="donation_type">Donation Type</label>
          <select
            id="donation_type"
            name="donation_type"
            value={formData.donation_type}
            onChange={handleChange}
            required
          >
            <option value="Whole Blood">Whole Blood</option>
            <option value="Power Red">Power Red</option>
            <option value="Platelet">Platelet</option>
            <option value="Plasma">Plasma</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="blood_amount_ml">Amount (ml)</label>
          <input
            type="number"
            id="blood_amount_ml"
            name="blood_amount_ml"
            value={formData.blood_amount_ml}
            onChange={handleChange}
            min={1}
            max={1000}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information about this donation"
            rows={3}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="donation-submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Donation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm; 