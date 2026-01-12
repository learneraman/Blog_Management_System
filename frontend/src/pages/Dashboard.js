import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../service/api";
import "../App.css";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/blogs");
      // Filter only current user's blogs
      const userId = localStorage.getItem("userId");
      const userBlogs = res.data.filter(blog => {
        const authorId = blog.author?._id || blog.author;
        return String(authorId) === String(userId);
      });
      setBlogs(userBlogs);
      setError("");
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setError("Failed to fetch your blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setSuccess("Blog deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Delete blog error:", err);
        setError("Failed to delete blog");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/blogs/edit/${id}`);
  };

  const getSortedBlogs = () => {
    const sorted = [...blogs];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const sortedBlogs = getSortedBlogs();

  if (loading) {
    return (
      <div className="container dashboard">
        <div className="loading">
          <div className="spinner"></div>
          Loading your blogs...
        </div>
      </div>
    );
  }

  const stats = {
    total: blogs.length,
    likes: blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0),
    comments: blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0),
  };

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <div>
          <h2>📊 Dashboard</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Manage your blog posts</p>
        </div>
        <button
          onClick={() => navigate("/blogs/new")}
          className="btn btn-primary btn-lg"
        >
          ✏️ Write New Blog
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Stats Section */}
      {blogs.length > 0 && (
        <div className="blog-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.total}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Blogs</p>
          </div>
          <div className="dashboard-card">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {stats.likes}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Likes</p>
          </div>
          <div className="dashboard-card">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.comments}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Comments</p>
          </div>
        </div>
      )}

      {/* Sort and Manage Section */}
      {blogs.length > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
          </select>
        </div>
      )}

      {/* Blogs List */}
      {blogs.length === 0 ? (
        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            📝 You haven't written any blogs yet
          </p>
          <button
            onClick={() => navigate("/blogs/new")}
            className="btn btn-primary"
          >
            Start Writing
          </button>
        </div>
      ) : (
        <div className="blog-grid">
          {sortedBlogs.map((blog) => (
            <div key={blog._id} className="blog-card card">
              <div className="blog-card-header">
                <h3>{blog.title}</h3>
                <p className="blog-card-meta">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="blog-card-body">
                <p>{blog.description?.substring(0, 100)}...</p>
                <div className="blog-tags">
                  {blog.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: '1.5rem', borderTop: '1px solid #e0e0e0', fontSize: '0.9rem', color: '#666' }}>
                <div style={{ marginBottom: '0.5rem' }}>❤️ {blog.likes?.length || 0} likes</div>
                <div style={{ marginBottom: '1rem' }}>💬 {blog.comments?.length || 0} comments</div>
              </div>
              <div className="blog-card-footer" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(blog._id)}
                    className="btn btn-primary btn-sm"
                    style={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#5568d3';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#667eea';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id, blog.title)}
                    className="btn btn-danger btn-sm"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc2626';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                  }}
                >
                  👁️ View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
