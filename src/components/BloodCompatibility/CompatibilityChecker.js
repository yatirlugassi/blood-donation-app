import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const CompatibilityChecker = () => {
  const [donorType, setDonorType] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Blood compatibility matrix
  const compatibilityMatrix = {
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'A+': ['A+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB+', 'AB-'],
    'AB+': ['AB+']
  };

  const checkCompatibility = async () => {
    if (!donorType || !recipientType) {
      setError('יש לבחור סוג דם של תורם ומקבל');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // First check local compatibility matrix
      const isCompatible = compatibilityMatrix[donorType]?.includes(recipientType);
      
      // Then log the check to the database for analytics
      const { error: logError } = await supabase
        .from('compatibility_checks')
        .insert({
          donor_type: donorType,
          recipient_type: recipientType,
          is_compatible: isCompatible,
          check_date: new Date().toISOString()
        });
        
      if (logError) {
        console.error('Error logging compatibility check:', logError);
      }
      
      setResult({
        compatible: isCompatible,
        message: isCompatible 
          ? `סוג דם ${donorType} יכול לתרום לסוג דם ${recipientType}` 
          : `סוג דם ${donorType} אינו יכול לתרום לסוג דם ${recipientType}`
      });
    } catch (err) {
      setError('שגיאה בבדיקת התאימות');
      console.error('Error checking compatibility:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibleTypes = (bloodType, isDonor = true) => {
    if (!bloodType) return [];
    
    if (isDonor) {
      // Return types that can receive from this donor
      return compatibilityMatrix[bloodType] || [];
    } else {
      // Return types that can donate to this recipient
      return Object.keys(compatibilityMatrix).filter(donor => 
        compatibilityMatrix[donor].includes(bloodType)
      );
    }
  };

  const resetForm = () => {
    setDonorType('');
    setRecipientType('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="compatibility-checker">
      <h2>בודק תאימות סוגי דם</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="compatibility-form">
        <div className="form-group">
          <label htmlFor="donor-type">סוג דם של התורם:</label>
          <select 
            id="donor-type"
            value={donorType}
            onChange={(e) => setDonorType(e.target.value)}
            disabled={loading}
          >
            <option value="">בחר סוג דם</option>
            {bloodTypes.map(type => (
              <option key={`donor-${type}`} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="recipient-type">סוג דם של המקבל:</label>
          <select 
            id="recipient-type"
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            disabled={loading}
          >
            <option value="">בחר סוג דם</option>
            {bloodTypes.map(type => (
              <option key={`recipient-${type}`} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            onClick={checkCompatibility}
            disabled={loading || !donorType || !recipientType}
            className="primary-button"
          >
            {loading ? 'בודק...' : 'בדוק תאימות'}
          </button>
          
          <button 
            onClick={resetForm}
            disabled={loading}
            className="secondary-button"
          >
            נקה
          </button>
        </div>
      </div>
      
      {result && (
        <div className={`compatibility-result ${result.compatible ? 'compatible' : 'incompatible'}`}>
          <h3>תוצאת הבדיקה:</h3>
          <p>{result.message}</p>
          
          {result.compatible && (
            <div className="compatibility-info">
              <p className="success-message">התרומה אפשרית! 💚</p>
            </div>
          )}
          
          {!result.compatible && (
            <div className="compatibility-info">
              <p className="warning-message">התרומה אינה אפשרית ❌</p>
              <p>סוגי דם שיכולים לתרום ל-{recipientType}:</p>
              <ul className="compatible-types-list">
                {getCompatibleTypes(recipientType, false).map(type => (
                  <li key={`can-donate-${type}`}>{type}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="compatibility-info-box">
        <h3>מידע על תאימות סוגי דם</h3>
        <p>תורם עם סוג דם O- נחשב ל"תורם אוניברסלי" ויכול לתרום לכל סוגי הדם.</p>
        <p>מקבל עם סוג דם AB+ נחשב ל"מקבל אוניברסלי" ויכול לקבל תרומה מכל סוגי הדם.</p>
      </div>
    </div>
  );
};

export default CompatibilityChecker; 