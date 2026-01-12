/**
 * Custom Hook: useBlog
 * Hook for blog-related operations
 */

import { useState, useCallback } from 'react';
import api from '../service/api';

export const useBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBlog = useCallback(async (blogData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create blog';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBlog = useCallback(async (blogId, blogData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/blogs/${blogId}`, blogData);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update blog';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBlog = useCallback(async (blogId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete blog';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogById = useCallback(async (blogId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch blog';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/blogs');
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch blogs';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getAllBlogs,
  };
};
