const React = require('react');
const { useState, useEffect } = React;
const { useAuth } = require('../../contexts/AuthContext');
const { supabase } = require('../../services/supabaseClient');

const GoalForm = ({ goal, isEditing, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    target_count: 4,
    target_date: '',
    current_count: 0,
    is_completed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (goal && isEditing) {
      setFormData({
        title: goal.title,
        target_count: goal.target_count,
        target_date: goal.target_date,
        current_count: goal.current_count,
        is_completed: goal.is_completed
      });
    }
  }, [goal, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'target_count' || name === 'current_count' ? parseInt(value, 10) : 
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && goal) {
        // Update existing goal
        const { data, error } = await supabase
          .from('goals')
          .update({
            ...goal,
            ...formData
          })
          .eq('id', goal.id)
          .single();

        if (error) throw error;
        
        if (onSuccess) onSuccess(data);
      } else {
        // Add new goal
        const { data, error } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            ...formData,
            current_count: 0,
            is_completed: false
          })
          .single();

        if (error) throw error;
        
        if (onSuccess) onSuccess(data);
        
        // Reset form after successful submission
        setFormData({
          title: '',
          target_count: 4,
          target_date: '',
          current_count: 0,
          is_completed: false
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-form-container">
      <h2>{isEditing ? 'עריכת יעד' : 'הוספת יעד חדש'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label htmlFor="title">כותרת היעד</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="לדוגמה: יעד שנתי, יעד רבעוני"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="target_count">מספר תרומות</label>
          <input
            type="number"
            id="target_count"
            name="target_count"
            value={formData.target_count}
            onChange={handleChange}
            min="1"
            max="20"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="target_date">תאריך יעד</label>
          <input
            type="date"
            id="target_date"
            name="target_date"
            value={formData.target_date}
            onChange={handleChange}
            required
          />
        </div>
        
        {isEditing && (
          <div className="form-group">
            <label htmlFor="current_count">מספר תרומות נוכחי</label>
            <input
              type="number"
              id="current_count"
              name="current_count"
              value={formData.current_count}
              onChange={handleChange}
              min="0"
              max={formData.target_count}
            />
          </div>
        )}
        
        {isEditing && (
          <div className="form-group checkbox-group">
            <label htmlFor="is_completed">
              <input
                type="checkbox"
                id="is_completed"
                name="is_completed"
                checked={formData.is_completed}
                onChange={handleChange}
              />
              יעד הושלם
            </label>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'מעבד...' : isEditing ? 'עדכן' : 'שמור'}
          </button>
        </div>
      </form>
    </div>
  );
};

module.exports = GoalForm; 