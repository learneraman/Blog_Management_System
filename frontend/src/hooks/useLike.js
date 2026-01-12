/**
 * Custom Hook: useLike
 * Hook for like-related operations
 */

import { useState, useCallback } from 'react';
import api from '../service/api';

export const useLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const likeBlog = useCallback(async (blogId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/blogs/${blogId}/like`, {});
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to like blog';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikeBlog = useCallback(async (blogId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/blogs/${blogId}/unlike`, {});
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to unlike blog';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    likeBlog,
    unlikeBlog,
  };
};
