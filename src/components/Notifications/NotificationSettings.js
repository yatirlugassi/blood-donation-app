const React = require('react');
const { useState, useEffect } = React;
const { useAuth } = require('../../contexts/AuthContext');
const { supabase } = require('../../services/supabaseClient');

const NotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    donation_reminders: true,
    achievement_notifications: true,
    community_notifications: false,
    system_notifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No settings found, create default settings
            await createDefaultSettings();
          } else {
            throw error;
          }
        } else {
          setSettings(data);
        }
      } catch (error) {
        setError('שגיאה בטעינת הגדרות ההתראות');
        console.error('Error fetching notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    const createDefaultSettings = async () => {
      try {
        const defaultSettings = {
          user_id: user.id,
          email_notifications: true,
          push_notifications: true,
          donation_reminders: true,
          achievement_notifications: true,
          community_notifications: false,
          system_notifications: true
        };
        
        const { data, error } = await supabase
          .from('notification_settings')
          .insert(defaultSettings)
          .single();
          
        if (error) throw error;
        
        setSettings(data || defaultSettings);
      } catch (error) {
        console.error('Error creating default notification settings:', error);
      }
    };

    if (user) {
      fetchSettings();
    }
  }, [user]);

  const handleToggle = async (setting) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      // Update locally first for immediate UI feedback
      const updatedSettings = {
        ...settings,
        [setting]: !settings[setting]
      };
      
      setSettings(updatedSettings);
      
      // Update in database
      const { error } = await supabase
        .from('notification_settings')
        .update(updatedSettings)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      
      setSuccessMessage('ההגדרות נשמרו בהצלחה');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError('שגיאה בשמירת ההגדרות');
      console.error('Error updating notification settings:', error);
      
      // Revert local state on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">טוען הגדרות התראות...</div>;

  return (
    <div className="notification-settings-container">
      <h2>הגדרות התראות</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="settings-list">
        <div className="settings-section">
          <h3>ערוצי התראות</h3>
          
          <div className="setting-item">
            <label htmlFor="email_notifications">
              <input
                type="checkbox"
                id="email_notifications"
                checked={settings.email_notifications}
                onChange={() => handleToggle('email_notifications')}
                disabled={saving}
              />
              התראות באימייל
            </label>
            <p className="setting-description">קבל התראות לכתובת האימייל שלך</p>
          </div>
          
          <div className="setting-item">
            <label htmlFor="push_notifications">
              <input
                type="checkbox"
                id="push_notifications"
                checked={settings.push_notifications}
                onChange={() => handleToggle('push_notifications')}
                disabled={saving}
              />
              התראות דחיפה
            </label>
            <p className="setting-description">קבל התראות ישירות למכשיר שלך</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>סוגי התראות</h3>
          
          <div className="setting-item">
            <label htmlFor="donation_reminders">
              <input
                type="checkbox"
                id="donation_reminders"
                checked={settings.donation_reminders}
                onChange={() => handleToggle('donation_reminders')}
                disabled={saving}
              />
              תזכורות תרומה
            </label>
            <p className="setting-description">קבל תזכורות כאשר אתה זכאי לתרום שוב</p>
          </div>
          
          <div className="setting-item">
            <label htmlFor="achievement_notifications">
              <input
                type="checkbox"
                id="achievement_notifications"
                checked={settings.achievement_notifications}
                onChange={() => handleToggle('achievement_notifications')}
                disabled={saving}
              />
              התראות הישגים
            </label>
            <p className="setting-description">קבל התראות כאשר אתה משיג יעדים או מקבל תגים</p>
          </div>
          
          <div className="setting-item">
            <label htmlFor="community_notifications">
              <input
                type="checkbox"
                id="community_notifications"
                checked={settings.community_notifications}
                onChange={() => handleToggle('community_notifications')}
                disabled={saving}
              />
              התראות קהילה
            </label>
            <p className="setting-description">קבל התראות על פעילות בקהילה, כגון תגובות ולייקים</p>
          </div>
          
          <div className="setting-item">
            <label htmlFor="system_notifications">
              <input
                type="checkbox"
                id="system_notifications"
                checked={settings.system_notifications}
                onChange={() => handleToggle('system_notifications')}
                disabled={saving}
              />
              התראות מערכת
            </label>
            <p className="setting-description">קבל התראות חשובות על המערכת, כגון תחזוקה ועדכונים</p>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = NotificationSettings; 