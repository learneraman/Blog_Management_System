/**
 * Custom Hook: useAuth
 * Hook for managing authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userId) {
      setUser({ id: userId, email: userEmail });
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData._id);
    localStorage.setItem('userEmail', userData.email);

    setUser({ id: userData._id, email: userData.email });
    setIsAuthenticated(true);

    return response.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name,
      email,
      password,
    });

    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  const getUserId = useCallback(() => {
    return localStorage.getItem('userId');
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    getToken,
    getUserId,
  };
};
