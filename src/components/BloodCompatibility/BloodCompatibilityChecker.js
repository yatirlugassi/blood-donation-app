const React = require('react');
const { useState } = React;

const BloodCompatibilityChecker = () => {
  const [donorType, setDonorType] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [result, setResult] = useState(null);

  // Blood compatibility chart
  const compatibilityChart = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  };

  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const checkCompatibility = () => {
    if (!donorType || !recipientType) {
      return;
    }

    const isCompatible = compatibilityChart[donorType].includes(recipientType);
    
    setResult({
      isCompatible,
      message: isCompatible 
        ? `${donorType} יכול לתרום ל-${recipientType}`
        : `${donorType} אינו יכול לתרום ל-${recipientType}`
    });
  };

  return (
    <div className="blood-compatibility-checker">
      <h2>בודק תאימות דם</h2>
      <p>בדוק אם סוג הדם שלך תואם לתרומה עבור מקבל מסוים</p>
      
      <div className="compatibility-form">
        <div className="form-group">
          <label htmlFor="donorType">סוג דם של התורם</label>
          <select 
            id="donorType"
            value={donorType}
            onChange={(e) => setDonorType(e.target.value)}
          >
            <option value="">בחר סוג דם</option>
            {bloodTypes.map(type => (
              <option key={`donor-${type}`} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="recipientType">סוג דם של המקבל</label>
          <select 
            id="recipientType"
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
          >
            <option value="">בחר סוג דם</option>
            {bloodTypes.map(type => (
              <option key={`recipient-${type}`} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <button 
          className="check-button"
          onClick={checkCompatibility}
        >
          בדוק תאימות
        </button>
      </div>
      
      {result && (
        <div className={`compatibility-result ${result.isCompatible ? 'compatible' : 'incompatible'}`}>
          <h3>{result.isCompatible ? 'תואם' : 'לא תואם'}</h3>
          <p>{result.message}</p>
          {result.isCompatible && (
            <p className="compatibility-note">
              תרומת דם יכולה להציל חיים! תודה על תרומתך.
            </p>
          )}
          {!result.isCompatible && (
            <p className="compatibility-note">
              אתה עדיין יכול לתרום דם, אך לא למקבל עם סוג דם זה.
            </p>
          )}
        </div>
      )}
      
      <div className="compatibility-info">
        <h3>מידע על תאימות דם</h3>
        <ul>
          <li>O- הוא התורם האוניברסלי (יכול לתרום לכל סוגי הדם)</li>
          <li>AB+ הוא המקבל האוניברסלי (יכול לקבל מכל סוגי הדם)</li>
          <li>תמיד ניתן לתרום לאדם עם אותו סוג דם כמו שלך</li>
        </ul>
      </div>
    </div>
  );
};

module.exports = BloodCompatibilityChecker; 