import { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * DataContext — global state for food records and alert UI state.
 * All mutations go through the dispatch so changes propagate app-wide.
 */

const DataContext = createContext(null);

const initialState = {
  // Records are loaded lazily per-page; new records added via /input are tracked here
  newRecords: [],   // records added in the current session
  alerts: [],       // alert state (read/dismissed) managed client-side
  alertsLoaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_RECORD':
      return { ...state, newRecords: [action.payload, ...state.newRecords] };

    case 'LOAD_ALERTS':
      return { ...state, alerts: action.payload, alertsLoaded: true };

    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload ? { ...a, read: true } : a
        ),
      };

    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload ? { ...a, dismissed: true } : a
        ),
      };

    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addRecord = useCallback((record) => {
    dispatch({ type: 'ADD_RECORD', payload: record });
  }, []);

  const loadAlerts = useCallback((alerts) => {
    dispatch({ type: 'LOAD_ALERTS', payload: alerts });
  }, []);

  const markAlertRead = useCallback((id) => {
    dispatch({ type: 'MARK_ALERT_READ', payload: id });
  }, []);

  const dismissAlert = useCallback((id) => {
    dispatch({ type: 'DISMISS_ALERT', payload: id });
  }, []);

  return (
    <DataContext.Provider value={{ state, addRecord, loadAlerts, markAlertRead, dismissAlert }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
}
