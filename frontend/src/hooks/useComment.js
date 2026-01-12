/**
 * Custom Hook: useComment
 * Hook for comment-related operations
 */

import { useState, useCallback } from 'react';
import api from '../service/api';

export const useComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComment = useCallback(async (blogId, text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, { text });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add comment';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (blogId, commentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/blogs/${blogId}/comments/${commentId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete comment';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addComment,
    deleteComment,
  };
};
