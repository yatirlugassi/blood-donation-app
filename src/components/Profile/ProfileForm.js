import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

const ProfileForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    blood_type: '',
    birth_date: '',
    phone: '',
    address: '',
    city: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    is_public_profile: false
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'לא ידוע'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found, will create a new one on save
            console.log('No profile found, will create on save');
          } else {
            throw error;
          }
        } else if (data) {
          // Format date for input field
          const formattedData = {
            ...data,
            birth_date: data.birth_date ? data.birth_date.split('T')[0] : ''
          };
          setFormData(formattedData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('שגיאה בטעינת פרופיל');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.first_name || !formData.last_name) {
      setError('שם פרטי ושם משפחה הם שדות חובה');
      return false;
    }
    
    if (formData.phone && !/^\d{9,10}$/.test(formData.phone)) {
      setError('מספר טלפון לא תקין');
      return false;
    }
    
    if (formData.emergency_contact_phone && !/^\d{9,10}$/.test(formData.emergency_contact_phone)) {
      setError('מספר טלפון לאיש קשר לא תקין');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const profileData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user.id)
          .select();
      } else {
        // Create new profile
        profileData.created_at = new Date().toISOString();
        result = await supabase
          .from('profiles')
          .insert(profileData)
          .select();
      }
      
      if (result.error) throw result.error;
      
      setSuccessMessage('הפרופיל נשמר בהצלחה');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.data[0]);
      }
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('שגיאה בשמירת הפרופיל');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">טוען פרופיל...</div>;
  }

  return (
    <div className="profile-form-container">
      <h2>עדכון פרופיל</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>פרטים אישיים</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">שם פרטי:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">שם משפחה:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="blood_type">סוג דם:</label>
              <select
                id="blood_type"
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                disabled={saving}
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
              <label htmlFor="birth_date">תאריך לידה:</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                disabled={saving}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>פרטי קשר</h3>
          
          <div className="form-group">
            <label htmlFor="phone">טלפון:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="מספר טלפון"
              disabled={saving}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address">כתובת:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="רחוב ומספר"
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">עיר:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="עיר מגורים"
                disabled={saving}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>פרטי חירום</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergency_contact_name">איש קשר לחירום:</label>
              <input
                type="text"
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                placeholder="שם איש קשר"
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emergency_contact_phone">טלפון איש קשר:</label>
              <input
                type="tel"
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                placeholder="מספר טלפון"
                disabled={saving}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="medical_conditions">מצב רפואי:</label>
            <textarea
              id="medical_conditions"
              name="medical_conditions"
              value={formData.medical_conditions}
              onChange={handleChange}
              placeholder="פרט מצבים רפואיים שחשוב לדעת עליהם (אופציונלי)"
              rows="3"
              disabled={saving}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>הגדרות פרטיות</h3>
          
          <div className="form-group checkbox-group">
            <label htmlFor="is_public_profile">
              <input
                type="checkbox"
                id="is_public_profile"
                name="is_public_profile"
                checked={formData.is_public_profile}
                onChange={handleChange}
                disabled={saving}
              />
              פרופיל ציבורי (מאפשר לאחרים לראות את שמך ברשימת המובילים)
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="primary-button"
            disabled={saving}
          >
            {saving ? 'שומר...' : 'שמור פרופיל'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 