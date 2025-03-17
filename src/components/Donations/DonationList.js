import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

const DonationList = ({ onEdit, onDelete }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .order('donation_date', { ascending: false })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setDonations(data || []);
      } catch (error) {
        setError('שגיאה בטעינת התרומות');
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDonations();
    }
  }, [user]);

  const handleEdit = (donation) => {
    if (onEdit) onEdit(donation);
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תרומה זו?')) {
      try {
        const { error } = await supabase
          .from('donations')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setDonations(donations.filter(donation => donation.id !== id));
        
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error('Error deleting donation:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) return <div className="loading">טוען תרומות...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="donation-list-container">
      <h2>היסטוריית תרומות</h2>
      
      {donations.length === 0 ? (
        <div className="no-donations">
          <p>אין תרומות להצגה</p>
          <p>הוסף את תרומת הדם הראשונה שלך!</p>
        </div>
      ) : (
        <div className="donation-list">
          {donations.map(donation => (
            <div key={donation.id} className="donation-card">
              <div className="donation-header">
                <h3>{donation.donation_center}</h3>
                <span className="donation-date">{formatDate(donation.donation_date)}</span>
              </div>
              
              <div className="donation-details">
                <p><strong>כמות:</strong> {donation.amount_ml} מ"ל</p>
                <p><strong>סוג תרומה:</strong> {donation.donation_type}</p>
                {donation.notes && <p><strong>הערות:</strong> {donation.notes}</p>}
              </div>
              
              <div className="donation-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(donation)}
                >
                  עריכה
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(donation.id)}
                >
                  מחיקה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationList; 