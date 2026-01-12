/**
 * Custom Hook: useFetch
 * Generic hook for fetching data with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        ...options,
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
