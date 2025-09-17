// Enhanced hook for managing data fetching with loading states and error handling
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Generic data fetching hook
export const useSupabaseData = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(options?.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      if (result?.error) {
        throw new Error(result?.error?.message || 'An error occurred');
      }
      
      setData(result?.data || null);
    } catch (err) {
      setError(err?.message || 'Network error occurred');
      if (options?.onError) {
        options?.onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, options]);

  useEffect(() => {
    if (user || !options?.requireAuth) {
      fetchData();
    }
  }, [fetchData, user, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData
  };
};

// Hook for paginated data
export const usePaginatedData = (fetchFunction, pageSize = 10, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { user } = useAuth();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction({
        offset: page * pageSize,
        limit: pageSize
      });
      
      if (result?.error) {
        throw new Error(result?.error?.message || 'An error occurred');
      }
      
      const newData = result?.data || [];
      
      if (page === 0) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }
      
      setHasMore(newData?.length === pageSize);
      setPage(prev => prev + 1);
      
    } catch (err) {
      setError(err?.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, loading, hasMore, page, pageSize]);

  const reset = useCallback(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (user) {
      reset();
      loadMore();
    }
  }, [user, ...dependencies]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};

// Hook for real-time data updates
export const useRealtimeData = (tableName, initialData = [], filters = {}) => {
  const [data, setData] = useState(initialData);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !tableName) return;

    // TODO: Implement Supabase realtime subscriptions
    // This would require setting up proper realtime listeners
    
    return () => {
      // Cleanup subscription
    };
  }, [user, tableName]);

  return { data, setData };
};