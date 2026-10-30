import { useState, useEffect, useCallback } from 'react';
import { getRecords } from '../services/api';
import { useData } from '../context/DataContext';

/**
 * useRecords — loads base records from the service, merges with any
 * new records added in this session (from DataContext), and exposes
 * helpers for adding records.
 */
export function useRecords() {
  const { state, addRecord } = useData();
  const [baseRecords, setBaseRecords] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecords();
      setBaseRecords(data);
    } catch (err) {
      setError(err.message ?? 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Merge session-added records (newest first) with base records
  const records = [...state.newRecords, ...baseRecords];

  return { records, loading, error, refetch: load, addRecord };
}
