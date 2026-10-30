import { useState, useEffect, useCallback } from 'react';
import { getAlerts as fetchAlerts } from '../services/api';
import { useData } from '../context/DataContext';

/**
 * useAlerts — loads alerts and delegates read/dismiss state to DataContext
 * so the unread badge in the sidebar stays in sync.
 */
export function useAlerts() {
  const { state, loadAlerts, markAlertRead, dismissAlert } = useData();
  const [loading, setLoading] = useState(!state.alertsLoaded);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    if (state.alertsLoaded) return; // already loaded for this session
    try {
      setLoading(true);
      const data = await fetchAlerts();
      loadAlerts(data);
    } catch (err) {
      setError(err.message ?? 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [state.alertsLoaded, loadAlerts]);

  useEffect(() => { load(); }, [load]);

  // Filter out dismissed alerts for display
  const activeAlerts    = state.alerts.filter(a => !a.dismissed);
  const unreadCount     = activeAlerts.filter(a => !a.read).length;

  return { alerts: activeAlerts, unreadCount, loading, error, markAlertRead, dismissAlert };
}
