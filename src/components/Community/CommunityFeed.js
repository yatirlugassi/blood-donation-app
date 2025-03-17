import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import PostForm from './PostForm';

const CommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const from = page * postsPerPage;
      const to = from + postsPerPage - 1;
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      setPosts(prevPosts => page === 0 ? data : [...prevPosts, ...data]);
      setHasMore(data.length === postsPerPage);
    } catch (error) {
      setError('שגיאה בטעינת הפוסטים');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId) => {
    try {
      // Find the post
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex === -1) return;
      
      // Update likes count locally
      const updatedPosts = [...posts];
      updatedPosts[postIndex].likes += 1;
      setPosts(updatedPosts);
      
      // Update in database
      await supabase
        .from('community_posts')
        .update({ likes: updatedPosts[postIndex].likes })
        .eq('id', postId)
        .single();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="community-feed-container">
      <h2>קהילת תורמי הדם</h2>
      
      {user && <PostForm onPostCreated={handleNewPost} />}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="posts-container">
        {posts.length === 0 && !loading ? (
          <div className="no-posts">
            <p>אין פוסטים להצגה</p>
            <p>היה הראשון לשתף את החוויה שלך!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-info">
                  <div className="user-avatar"></div>
                  <span className="user-name">{post.user_name}</span>
                </div>
                <span className="post-date">{formatDate(post.created_at)}</span>
              </div>
              
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              
              <div className="post-actions">
                <button 
                  className="like-button"
                  onClick={() => handleLike(post.id)}
                >
                  <span className="like-icon">❤️</span>
                  <span className="like-count">{post.likes}</span>
                </button>
                
                <button className="comment-button">
                  <span className="comment-icon">💬</span>
                  <span className="comment-count">{post.comments_count}</span>
                </button>
                
                <button className="share-button">
                  <span className="share-icon">🔗</span>
                  <span>שתף</span>
                </button>
              </div>
            </div>
          ))
        )}
        
        {loading && <div className="loading">טוען פוסטים...</div>}
        
        {hasMore && !loading && (
          <button 
            className="load-more-button"
            onClick={loadMore}
          >
            טען עוד
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed; 