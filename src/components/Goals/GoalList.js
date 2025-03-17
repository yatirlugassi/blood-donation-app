const React = require('react');
const { useState, useEffect } = React;
const { useAuth } = require('../../contexts/AuthContext');
const { supabase } = require('../../services/supabaseClient');

const GoalList = ({ onEdit, onDelete }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .order('target_date', { ascending: true })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setGoals(data || []);
      } catch (error) {
        setError('שגיאה בטעינת היעדים');
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGoals();
    }
  }, [user]);

  const handleEdit = (goal) => {
    if (onEdit) onEdit(goal);
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק יעד זה?')) {
      try {
        const { error } = await supabase
          .from('goals')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setGoals(goals.filter(goal => goal.id !== id));
        
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (loading) return <div className="loading">טוען יעדים...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="goal-list-container">
      <h2>היעדים שלי</h2>
      
      {goals.length === 0 ? (
        <div className="no-goals">
          <p>אין יעדים להצגה</p>
          <p>הגדר יעד חדש כדי לעקוב אחר התקדמותך!</p>
        </div>
      ) : (
        <div className="goal-list">
          {goals.map(goal => (
            <div 
              key={goal.id} 
              className={`goal-card ${goal.is_completed ? 'completed' : ''}`}
            >
              <div className="goal-header">
                <h3>{goal.title}</h3>
                <span className="goal-date">{formatDate(goal.target_date)}</span>
              </div>
              
              <div className="goal-progress">
                <div className="progress-text">
                  <span>{goal.current_count}/{goal.target_count}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${calculateProgress(goal.current_count, goal.target_count)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="goal-status">
                {goal.is_completed ? (
                  <span className="status-completed">הושלם</span>
                ) : (
                  <span className="status-active">פעיל</span>
                )}
              </div>
              
              <div className="goal-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(goal)}
                >
                  עריכה
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(goal.id)}
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

module.exports = GoalList; 