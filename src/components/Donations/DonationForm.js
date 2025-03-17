import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

const DonationForm = ({ donationToEdit, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    donation_date: '',
    location_id: '',
    blood_type: '',
    amount_ml: 450,
    notes: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    // Fetch donation locations
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('donation_locations')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching donation locations:', err);
        setError('שגיאה בטעינת מיקומי תרומה');
      }
    };

    fetchLocations();

    // If editing an existing donation, populate the form
    if (donationToEdit) {
      setFormData({
        donation_date: donationToEdit.donation_date.split('T')[0], // Format date for input
        location_id: donationToEdit.location_id,
        blood_type: donationToEdit.blood_type,
        amount_ml: donationToEdit.amount_ml,
        notes: donationToEdit.notes || ''
      });
    }
  }, [donationToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.donation_date) {
      setError('יש להזין תאריך תרומה');
      return false;
    }
    
    if (!formData.location_id) {
      setError('יש לבחור מיקום תרומה');
      return false;
    }
    
    if (!formData.blood_type) {
      setError('יש לבחור סוג דם');
      return false;
    }
    
    if (!formData.amount_ml || formData.amount_ml < 100) {
      setError('יש להזין כמות תקינה (מינימום 100 מ"ל)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const donationData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (donationToEdit) {
        // Update existing donation
        result = await supabase
          .from('donations')
          .update(donationData)
          .eq('id', donationToEdit.id)
          .select();
      } else {
        // Add new donation
        donationData.created_at = new Date().toISOString();
        result = await supabase
          .from('donations')
          .insert(donationData)
          .select();
      }
      
      if (result.error) throw result.error;
      
      // Reset form after successful submission
      if (!donationToEdit) {
        setFormData({
          donation_date: '',
          location_id: '',
          blood_type: '',
          amount_ml: 450,
          notes: ''
        });
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.data[0]);
      }
      
    } catch (err) {
      console.error('Error saving donation:', err);
      setError('שגיאה בשמירת התרומה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <h2>{donationToEdit ? 'עריכת תרומה' : 'הוספת תרומה חדשה'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="donation_date">תאריך תרומה:</label>
          <input
            type="date"
            id="donation_date"
            name="donation_date"
            value={formData.donation_date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location_id">מיקום תרומה:</label>
          <select
            id="location_id"
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">בחר מיקום</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="blood_type">סוג דם:</label>
          <select
            id="blood_type"
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">בחר סוג דם</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount_ml">כמות (מ"ל):</label>
          <input
            type="number"
            id="amount_ml"
            name="amount_ml"
            value={formData.amount_ml}
            onChange={handleChange}
            min="100"
            max="1000"
            required
            disabled={loading}
          />
          <small>כמות רגילה: 450 מ"ל</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">הערות:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            disabled={loading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'שומר...' : donationToEdit ? 'עדכן תרומה' : 'הוסף תרומה'}
          </button>
          
          {onSuccess && (
            <button 
              type="button" 
              className="secondary-button"
              onClick={() => onSuccess()}
              disabled={loading}
            >
              ביטול
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DonationForm; 