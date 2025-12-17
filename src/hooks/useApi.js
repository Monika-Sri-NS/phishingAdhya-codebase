import { useState, useEffect, useCallback } from 'react';
import {ApiService} from '../services/api';

// Custom hook for API calls with loading states and error handling
export function useApi(apiCall, dependencies = [], options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { immediate = true, onSuccess, onError } = options;

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      setData(result);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
}

// Specialized hooks for different API endpoints
export function useDashboardStats() {
  return useApi(() => ApiService.getDashboardStats(), []);
}

export function usePhishingTrends(timeRange = '7d') {
  return useApi(() => ApiService.getPhishingTrends(timeRange), [timeRange]);
}

export function useReports(filters = {}) {
  return useApi(() => ApiService.getReports(filters), [JSON.stringify(filters)]);
}

export function useAlerts(filters = {}) {
  return useApi(() => ApiService.getAlerts(filters), [JSON.stringify(filters)]);
}

export function useLogs(filters = {}) {
  return useApi(() => ApiService.getLogs(filters), [JSON.stringify(filters)]);
}

export function useUserProfile() {
  return useApi(() => ApiService.getUserProfile(), []);
}