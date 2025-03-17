import React, { useState } from 'react';
import { DonationGoal, addDonationGoal, updateDonationGoal } from '../../services/dashboardService';

interface GoalTrackerProps {
  goals: DonationGoal[];
  showViewAll: (() => void) | null;
  compact: boolean;
  onGoalCompleted: (goalId: number) => void;
  currentDonationCount: number;
  onGoalAdded?: (goal: DonationGoal) => void;
  userId?: string;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({
  goals,
  showViewAll,
  compact,
  onGoalCompleted,
  currentDonationCount,
  onGoalAdded,
  userId
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    target_count: currentDonationCount + 1,
    target_date: '',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const goalData = {
        ...newGoal,
        user_id: userId,
        is_completed: false,
        target_date: newGoal.target_date || null,
        description: newGoal.description || null
      };

      const { data, error } = await addDonationGoal(goalData);

      if (error) {
        throw new Error(error.message);
      }

      if (data && onGoalAdded) {
        onGoalAdded(data);
        setShowAddForm(false);
        setNewGoal({
          target_count: currentDonationCount + 1,
          target_date: '',
          title: '',
          description: '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (goal: DonationGoal) => {
    try {
      const { error } = await updateDonationGoal(goal.id, { is_completed: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      onGoalCompleted(goal.id);
    } catch (err) {
      console.error('Error marking goal as completed:', err);
    }
  };

  const calculateProgress = (goal: DonationGoal) => {
    if (goal.target_count <= 0) return 0;
    const progress = (currentDonationCount / goal.target_count) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  const getTimeLeft = (goal: DonationGoal) => {
    if (!goal.target_date) return 'No deadline';
    
    const targetDate = new Date(goal.target_date);
    const now = new Date();
    
    if (targetDate <= now) return 'Expired';
    
    const diffTime = Math.abs(targetDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days left`;
  };

  if (goals.length === 0 && !showAddForm) {
    return (
      <div className="no-goals">
        <p>You haven't set any donation goals yet.</p>
        {!compact && (
          <button 
            className="add-goal-btn" 
            onClick={() => setShowAddForm(true)}
          >
            Set a Donation Goal
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="goal-tracker">
      {error && <div className="error-message">Error: {error}</div>}
      
      {showAddForm ? (
        <div className="add-goal-form-container">
          <h3>Create New Goal</h3>
          <form onSubmit={handleGoalSubmit} className="add-goal-form">
            <div className="form-group">
              <label htmlFor="title">Goal Title</label>
              <input
                type="text"
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g., Become a Regular Donor"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="target_count">Target Donations</label>
              <input
                type="number"
                id="target_count"
                value={newGoal.target_count}
                onChange={(e) => setNewGoal({...newGoal, target_count: parseInt(e.target.value)})}
                min={currentDonationCount + 1}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="target_date">Target Date (Optional)</label>
              <input
                type="date"
                id="target_date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Why do you want to achieve this goal?"
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
                className="save-goal-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className={`goals-list ${compact ? 'compact' : ''}`}>
            {goals.map((goal) => {
              const progress = calculateProgress(goal);
              const progressClassName = progress >= 100 ? 'progress-complete' : 'progress-incomplete';
              
              return (
                <div key={goal.id} className={`goal-item ${goal.is_completed ? 'completed' : ''}`}>
                  <div className="goal-info">
                    <h3 className="goal-title">{goal.title}</h3>
                    {!compact && goal.description && (
                      <p className="goal-description">{goal.description}</p>
                    )}
                    
                    <div className="goal-progress-container">
                      <div 
                        className={`goal-progress-bar ${progressClassName}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div className="goal-progress-text">
                        {currentDonationCount} of {goal.target_count} donations
                      </div>
                    </div>
                    
                    <div className="goal-meta">
                      {goal.target_date && (
                        <span className="goal-deadline">
                          {getTimeLeft(goal)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {!compact && !goal.is_completed && currentDonationCount >= goal.target_count && (
                    <button
                      className="mark-complete-btn"
                      onClick={() => handleMarkCompleted(goal)}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          {!compact && (
            <div className="goals-actions">
              <button 
                className="add-goal-btn" 
                onClick={() => setShowAddForm(true)}
              >
                Add New Goal
              </button>
            </div>
          )}
          
          {showViewAll && goals.length > 0 && (
            <div className="view-all-container">
              <button className="view-all-btn" onClick={showViewAll}>
                View All Goals
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GoalTracker; 