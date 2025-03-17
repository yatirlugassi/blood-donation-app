import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const RegionalNeeds = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [needsData, setNeedsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('regions')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setRegions(data || []);
        
        // Auto-select first region if available
        if (data && data.length > 0) {
          setSelectedRegion(data[0].id);
        }
      } catch (err) {
        setError('שגיאה בטעינת אזורים');
        console.error('Error fetching regions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchRegionalNeeds(selectedRegion);
    }
  }, [selectedRegion]);

  const fetchRegionalNeeds = async (regionId) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('regional_needs')
        .select(`
          id,
          region_id,
          regions(name),
          a_pos_need,
          a_neg_need,
          b_pos_need,
          b_neg_need,
          ab_pos_need,
          ab_neg_need,
          o_pos_need,
          o_neg_need,
          last_updated
        `)
        .eq('region_id', regionId)
        .single();
        
      if (error) throw error;
      
      setNeedsData(data);
    } catch (err) {
      setError('שגיאה בטעינת נתוני צרכים אזוריים');
      console.error('Error fetching regional needs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNeedLevel = (level) => {
    if (level >= 4) return { text: 'קריטי', class: 'critical' };
    if (level >= 3) return { text: 'גבוה', class: 'high' };
    if (level >= 2) return { text: 'בינוני', class: 'medium' };
    if (level >= 1) return { text: 'נמוך', class: 'low' };
    return { text: 'אין צורך', class: 'none' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (loading && !needsData) {
    return <div className="loading">טוען נתוני צרכים אזוריים...</div>;
  }

  return (
    <div className="regional-needs-container">
      <h2>צרכי תרומות דם לפי אזור</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="region-selector">
        <label htmlFor="region-select">בחר אזור:</label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          disabled={loading || regions.length === 0}
        >
          {regions.length === 0 && <option value="">אין אזורים זמינים</option>}
          
          {regions.map(region => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
      
      {needsData && (
        <div className="needs-data">
          <h3>צרכי דם באזור {needsData.regions.name}</h3>
          <p className="last-updated">
            עודכן לאחרונה: {formatDate(needsData.last_updated)}
          </p>
          
          <div className="blood-types-grid">
            <div className={`blood-type-card ${getNeedLevel(needsData.a_pos_need).class}`}>
              <h4>A+</h4>
              <div className="need-level">
                {getNeedLevel(needsData.a_pos_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`a-pos-${i}`} 
                    className={i < needsData.a_pos_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.a_neg_need).class}`}>
              <h4>A-</h4>
              <div className="need-level">
                {getNeedLevel(needsData.a_neg_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`a-neg-${i}`} 
                    className={i < needsData.a_neg_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.b_pos_need).class}`}>
              <h4>B+</h4>
              <div className="need-level">
                {getNeedLevel(needsData.b_pos_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`b-pos-${i}`} 
                    className={i < needsData.b_pos_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.b_neg_need).class}`}>
              <h4>B-</h4>
              <div className="need-level">
                {getNeedLevel(needsData.b_neg_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`b-neg-${i}`} 
                    className={i < needsData.b_neg_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.ab_pos_need).class}`}>
              <h4>AB+</h4>
              <div className="need-level">
                {getNeedLevel(needsData.ab_pos_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`ab-pos-${i}`} 
                    className={i < needsData.ab_pos_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.ab_neg_need).class}`}>
              <h4>AB-</h4>
              <div className="need-level">
                {getNeedLevel(needsData.ab_neg_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`ab-neg-${i}`} 
                    className={i < needsData.ab_neg_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.o_pos_need).class}`}>
              <h4>O+</h4>
              <div className="need-level">
                {getNeedLevel(needsData.o_pos_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`o-pos-${i}`} 
                    className={i < needsData.o_pos_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
            
            <div className={`blood-type-card ${getNeedLevel(needsData.o_neg_need).class}`}>
              <h4>O-</h4>
              <div className="need-level">
                {getNeedLevel(needsData.o_neg_need).text}
              </div>
              <div className="need-indicator">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={`o-neg-${i}`} 
                    className={i < needsData.o_neg_need ? 'filled' : 'empty'}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="needs-legend">
            <h4>מקרא רמות צורך:</h4>
            <ul>
              <li className="critical">קריטי - נדרשות תרומות באופן מיידי</li>
              <li className="high">גבוה - מלאי נמוך, נדרשות תרומות בהקדם</li>
              <li className="medium">בינוני - מלאי מתחת לממוצע</li>
              <li className="low">נמוך - מלאי תקין</li>
              <li className="none">אין צורך - מלאי מספק</li>
            </ul>
          </div>
          
          <div className="call-to-action">
            <h3>עזרו לנו להציל חיים!</h3>
            <p>
              אם סוג הדם שלך נמצא בביקוש גבוה באזור שלך, אנא שקול לתרום בהקדם.
              כל תרומה יכולה להציל עד 3 חיים!
            </p>
            <button className="primary-button">קבע תור לתרומה</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalNeeds; 