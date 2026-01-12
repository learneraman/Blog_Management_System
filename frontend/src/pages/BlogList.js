import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../service/api';
import '../App.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/blogs');
      setBlogs(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch blogs error:', err);
      setError('Failed to fetch blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    blogs.forEach(blog => {
      blog.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [blogs]);

  // Filter blogs based on search and selected tag
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || blog.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [blogs, searchTerm, selectedTag]);

  if (loading) {
    return (
      <div className="container blog-list">
        <div className="loading">
          <div className="spinner"></div>
          Loading blogs...
        </div>
      </div>
    );
  }

  return (
    <div className="container blog-list">
      <div className="blog-list-header">
        <div>
          <h2>✍️ All Blogs</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {localStorage.getItem('token') && (
          <Link to="/blogs/new" className="btn btn-primary">
            ✏️ Write Blog
          </Link>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {/* Search and Filter Section */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search blogs"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        {(searchTerm || selectedTag) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTag('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Blogs Grid */}
      <div className="blog-grid">
        {filteredBlogs.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              {searchTerm || selectedTag ? '📭 No blogs match your search' : '📚 No blogs yet'}
            </p>
            {!localStorage.getItem('token') && (
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="blog-card card">
              <div className="blog-card-header">
                <h3>{blog.title}</h3>
                <p className="blog-card-meta">By {blog.author?.name || 'Unknown'}</p>
              </div>
              <div className="blog-card-body">
                <p>{blog.description?.substring(0, 120)}...</p>
                <div className="blog-tags">
                  {blog.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                  {blog.tags?.length > 3 && (
                    <span className="tag">+{blog.tags.length - 3}</span>
                  )}
                </div>
              </div>
              <div className="blog-card-footer">
                <Link 
                  to={`/blogs/${blog._id}`} 
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: 'auto' }}
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;