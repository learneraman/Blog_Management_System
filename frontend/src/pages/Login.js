import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../service/api";
import "../App.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userEmail", res.data.user.email);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔑 Login</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="current-password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔑 Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
        
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid #e0e0e0',
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0.5rem 0' }}>Demo credentials:</p>
          <p style={{ margin: '0.25rem 0' }}>Email: <code>admin@example.com</code></p>
          <p style={{ margin: '0.25rem 0' }}>Password: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
