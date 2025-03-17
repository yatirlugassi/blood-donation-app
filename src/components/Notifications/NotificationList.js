const React = require('react');
const { useState, useEffect } = React;
const { useAuth } = require('../../contexts/AuthContext');
const { supabase } = require('../../services/supabaseClient');

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error) {
        setError('שגיאה בטעינת ההתראות');
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      // Update locally first for immediate UI feedback
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true } 
          : notification
      ));
      
      // Update in database
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .single();
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Update locally first for immediate UI feedback
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      
      // Delete from database
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .single();
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return '🔔';
      case 'achievement':
        return '🏆';
      case 'system':
        return '⚙️';
      case 'campaign':
        return '📢';
      default:
        return '📩';
    }
  };

  if (loading) return <div className="loading">טוען התראות...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="notification-list-container">
      <h2>התראות</h2>
      
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>אין התראות להצגה</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              data-testid={!notification.is_read ? 'unread-notification' : 'read-notification'}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">{formatDate(notification.created_at)}</span>
              </div>
              
              <div className="notification-actions">
                {!notification.is_read && (
                  <button 
                    className="mark-read-button"
                    onClick={() => markAsRead(notification.id)}
                    title="סמן כנקרא"
                  >
                    ✓
                  </button>
                )}
                
                <button 
                  className="delete-button"
                  onClick={() => deleteNotification(notification.id)}
                  title="מחק"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

module.exports = NotificationList; 