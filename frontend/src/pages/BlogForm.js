import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../service/api';
import '../App.css';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', tags: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);
  const [charCount, setCharCount] = useState({ title: 0, description: 0 });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${id}`);
      setFormData({
        title: res.data.title,
        description: res.data.description,
        tags: res.data.tags.join(', '),
      });
      setCharCount({
        title: res.data.title.length,
        description: res.data.description.length,
      });
    } catch (err) {
      console.error('Fetch blog error:', err);
      setError('Failed to fetch blog');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'title') {
      setCharCount(prev => ({ ...prev, title: value.length }));
    } else if (name === 'description') {
      setCharCount(prev => ({ ...prev, description: value.length }));
    }
    
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const submitData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      };

      if (id) {
        await axios.put(`/blogs/${id}`, submitData);
        setSuccess('Blog updated successfully! Redirecting...');
      } else {
        await axios.post('/blogs', submitData);
        setSuccess('Blog created successfully! Redirecting...');
      }
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.errors?.[0]?.msg || 
                      'Failed to save blog';
      setError(errorMsg);
      console.error('Error saving blog:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container blog-form">
        <div className="loading">
          <div className="spinner"></div>
          Loading blog...
        </div>
      </div>
    );
  }

  return (
    <div className="container blog-form">
      <h2>{id ? '✏️ Edit Blog' : '✏️ Create New Blog'}</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="card form-card">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging title..."
            disabled={loading}
            required
            minLength="3"
          />
          <small style={{ display: 'block', color: '#666', marginTop: '0.25rem' }}>
            {charCount.title} characters (min 3)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Blog Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write your blog content here... Make it engaging and informative!"
            rows="10"
            disabled={loading}
            required
            minLength="10"
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
          <small style={{ display: 'block', color: '#666', marginTop: '0.25rem' }}>
            {charCount.description} characters (min 10)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., tech, coding, tutorial, react"
            disabled={loading}
          />
          <small style={{ display: 'block', color: '#666', marginTop: '0.25rem' }}>
            Separate tags with commas
          </small>
        </div>

        {formData.tags && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Preview Tags:
            </p>
            <div className="blog-tags">
              {formData.tags.split(',').map((tag, idx) => {
                const trimmedTag = tag.trim();
                return trimmedTag ? <span key={idx} className="tag">{trimmedTag}</span> : null;
              })}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                {id ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{id ? '✏️ Update Blog' : '✏️ Publish Blog'}</>
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;