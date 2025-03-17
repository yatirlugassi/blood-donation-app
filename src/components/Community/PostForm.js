import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

const PostForm = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('אנא הזן תוכן לפוסט');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newPost = {
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        content: content.trim(),
        likes: 0,
        comments_count: 0
      };
      
      const { data, error } = await supabase
        .from('community_posts')
        .insert(newPost)
        .single();
        
      if (error) throw error;
      
      setContent('');
      
      if (onPostCreated) onPostCreated(data);
    } catch (error) {
      setError('שגיאה בפרסום הפוסט');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-container">
      <h3>שתף את החוויה שלך</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          placeholder="שתף את החוויה שלך עם הקהילה..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
          maxLength="500"
          required
        />
        
        <div className="form-actions">
          <span className="char-count">{content.length}/500</span>
          <button 
            type="submit" 
            className="publish-button"
            disabled={loading || !content.trim()}
          >
            {loading ? 'מפרסם...' : 'פרסם'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 