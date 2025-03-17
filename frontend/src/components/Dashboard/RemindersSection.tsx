import React, { useState } from 'react';
import { DonationReminder, addReminder, markReminderAsRead } from '../../services/dashboardService';

interface RemindersSectionProps {
  reminders: DonationReminder[];
  showViewAll: (() => void) | null;
  compact: boolean;
  userId?: string;
}

const RemindersSection: React.FC<RemindersSectionProps> = ({
  reminders,
  showViewAll,
  compact,
  userId
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    reminder_date: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 56 days from now
    title: 'Next Donation Reminder',
    message: '',
    is_read: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedReminders, setUpdatedReminders] = useState<DonationReminder[]>(reminders);

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reminderData = {
        ...newReminder,
        user_id: userId
      };

      const { data, error } = await addReminder(reminderData);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setUpdatedReminders([...updatedReminders, data]);
        setShowAddForm(false);
        // Reset form
        setNewReminder({
          reminder_date: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: 'Next Donation Reminder',
          message: '',
          is_read: false
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (reminder: DonationReminder) => {
    try {
      const { error } = await markReminderAsRead(reminder.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setUpdatedReminders(
        updatedReminders.map(r => 
          r.id === reminder.id ? { ...r, is_read: true } : r
        )
      );
    } catch (err) {
      console.error('Error marking reminder as read:', err);
    }
  };

  const displayReminders = updatedReminders.filter(r => compact ? !r.is_read : true);

  if (displayReminders.length === 0 && !showAddForm) {
    return (
      <div className="no-reminders">
        <p>You don't have any {compact ? 'unread ' : ''}reminders.</p>
        {!compact && userId && (
          <button 
            className="add-reminder-btn" 
            onClick={() => setShowAddForm(true)}
          >
            Create a Reminder
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="reminders-section">
      {error && <div className="error-message">Error: {error}</div>}
      
      {showAddForm ? (
        <div className="add-reminder-form-container">
          <h3>Create New Reminder</h3>
          <form onSubmit={handleReminderSubmit} className="add-reminder-form">
            <div className="form-group">
              <label htmlFor="reminder_date">Reminder Date</label>
              <input
                type="date"
                id="reminder_date"
                value={newReminder.reminder_date}
                onChange={(e) => setNewReminder({...newReminder, reminder_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                placeholder="e.g., Schedule Next Donation"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                value={newReminder.message || ''}
                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                placeholder="Additional details about this reminder"
                rows={3}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-reminder-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className={`reminders-list ${compact ? 'compact' : ''}`}>
            {displayReminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`reminder-item ${reminder.is_read ? 'read' : 'unread'}`}
              >
                <div className="reminder-info">
                  <div className="reminder-header">
                    <h3 className="reminder-title">{reminder.title}</h3>
                    <span className="reminder-date">
                      {new Date(reminder.reminder_date).toLocaleDateString()}
                    </span>
                  </div>
                  {(!compact || (compact && reminder.message)) && (
                    <p className="reminder-message">
                      {reminder.message || 'No additional details provided.'}
                    </p>
                  )}
                </div>
                
                {!reminder.is_read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => handleMarkAsRead(reminder)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {!compact && userId && (
            <div className="reminders-actions">
              <button 
                className="add-reminder-btn" 
                onClick={() => setShowAddForm(true)}
              >
                Add New Reminder
              </button>
            </div>
          )}
          
          {showViewAll && displayReminders.length > 0 && (
            <div className="view-all-container">
              <button className="view-all-btn" onClick={showViewAll}>
                View All Reminders
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RemindersSection; 