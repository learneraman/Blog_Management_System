import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../service/api';
import '../App.css';

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const fetchBlog = useCallback(async () => {
    try {
      const res = await axios.get(`/blogs/${id}`);
      setBlog(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch blog error:', err);
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      setError('Please login to comment');
      return;
    }
    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }
    try {
      const res = await axios.post(`/blogs/${id}/comments`, {
        text: commentText,
      });
      setBlog(res.data);
      setCommentText('');
      setSuccess('Comment posted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await axios.delete(`/blogs/${id}/comments/${commentId}`);
      setBlog(res.data);
      setSuccess('Comment deleted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      setError('Please login to like');
      return;
    }
    try {
      setLiking(true);
      const res = await axios.post(`/blogs/${id}/like`);
      setBlog(res.data);
      setSuccess('Liked!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (err.response?.status === 400) {
        handleUnlike();
      } else {
        setError('Failed to like blog');
      }
    } finally {
      setLiking(false);
    }
  };

  const handleUnlike = async () => {
    try {
      setLiking(true);
      const res = await axios.post(`/blogs/${id}/unlike`);
      setBlog(res.data);
    } catch (err) {
      setError('Failed to unlike blog');
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="container blog-view">
        <div className="loading">
          <div className="spinner"></div>
          Loading blog...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container blog-view">
        <div className="empty-state">
          <p>📭 Blog not found</p>
        </div>
      </div>
    );
  }

  const userId = localStorage.getItem('userId');
  const isLiked = blog.likes?.some(like => {
    // Handle both ObjectId and string comparison
    const likeId = like._id || like;
    return String(likeId) === String(userId);
  });
  const likeCount = blog.likes?.length || 0;
  const commentCount = blog.comments?.length || 0;

  return (
    <div className="blog-view">
      <div className="blog-view-header">
        <div className="container">
          <h2>{blog.title}</h2>
          <div className="blog-view-meta">
            <span>✍️ By <strong>{blog.author?.name || 'Unknown'}</strong></span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span>📖 {Math.ceil(blog.description.length / 200)} min read</span>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Blog Content */}
        <div className="blog-content">
          {blog.description.split('\n').map((paragraph, idx) => (
            paragraph.trim() && (
              <p key={idx}>{paragraph}</p>
            )
          ))}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div style={{ margin: '2rem 0' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Tags:</p>
            <div className="blog-tags">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Likes Section */}
        <div className="likes-section">
          <button
            onClick={isLiked ? handleUnlike : handleLike}
            className={`like-button ${isLiked ? 'liked' : ''}`}
            disabled={liking || !isLoggedIn}
            title={isLoggedIn ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
          >
            {isLiked ? '❤️ Liked' : '🤍 Like'}
          </button>
          <span className="like-count">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>💬 Comments ({commentCount})</h3>

          {/* Add Comment */}
          {isLoggedIn && (
            <div className="add-comment">
              <textarea
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setError('');
                }}
                placeholder="Share your thoughts..."
                rows="4"
              />
              <button
                onClick={handleAddComment}
                className="btn btn-success"
              >
                Post Comment
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <div className="add-comment" style={{ textAlign: 'center', color: '#666' }}>
              <p>Please <a href="/login" style={{ color: '#667eea', fontWeight: 'bold' }}>login</a> to comment</p>
            </div>
          )}

          {/* Display Comments */}
          <div className="comments-list">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment, index) => (
                <div key={comment._id || index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.user?.name || 'Anonymous'}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    {isLoggedIn && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete comment"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;