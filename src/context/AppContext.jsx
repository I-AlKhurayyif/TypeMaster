import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadProgress, saveProgress, exportProgress, importProgress } from '../utils/storage';

// Initial state
const initialState = {
  // App settings
  theme: 'light',
  mode: null, // 'learning' or 'test'
  difficulty: 'Beginner',

  // Typing content
  exercises: [],
  currentExercise: null,

  // Session state
  isSessionActive: false,
  sessionStartTime: null,

  // Progress tracking
  history: [],
  mistypedKeys: {},

  // Current session stats
  currentStats: {
    wpm: 0,
    accuracy: 100,
    errors: 0,
    totalChars: 0,
    correctChars: 0,
  },

  // Results (after test completion)
  results: null,

  // Loading states
  isLoading: true,
  error: null,
};

// Action types
const ActionTypes = {
  SET_THEME: 'SET_THEME',
  SET_MODE: 'SET_MODE',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_EXERCISES: 'SET_EXERCISES',
  SET_CURRENT_EXERCISE: 'SET_CURRENT_EXERCISE',
  START_SESSION: 'START_SESSION',
  END_SESSION: 'END_SESSION',
  UPDATE_STATS: 'UPDATE_STATS',
  SET_RESULTS: 'SET_RESULTS',
  CLEAR_RESULTS: 'CLEAR_RESULTS',
  ADD_HISTORY: 'ADD_HISTORY',
  SET_HISTORY: 'SET_HISTORY',
  UPDATE_MISTYPED_KEYS: 'UPDATE_MISTYPED_KEYS',
  SET_MISTYPED_KEYS: 'SET_MISTYPED_KEYS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_SESSION: 'RESET_SESSION',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };

    case ActionTypes.SET_MODE:
      return { ...state, mode: action.payload, results: null };

    case ActionTypes.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload };

    case ActionTypes.SET_EXERCISES:
      return { ...state, exercises: action.payload, isLoading: false };

    case ActionTypes.SET_CURRENT_EXERCISE:
      return { ...state, currentExercise: action.payload };

    case ActionTypes.START_SESSION:
      return {
        ...state,
        isSessionActive: true,
        sessionStartTime: Date.now(),
        currentStats: {
          wpm: 0,
          accuracy: 100,
          errors: 0,
          totalChars: 0,
          correctChars: 0,
        },
        results: null,
      };

    case ActionTypes.END_SESSION:
      return {
        ...state,
        isSessionActive: false,
        sessionStartTime: null,
      };

    case ActionTypes.UPDATE_STATS:
      return {
        ...state,
        currentStats: { ...state.currentStats, ...action.payload },
      };

    case ActionTypes.SET_RESULTS:
      return { ...state, results: action.payload };

    case ActionTypes.CLEAR_RESULTS:
      return { ...state, results: null };

    case ActionTypes.ADD_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 100), // Keep last 100 sessions
      };

    case ActionTypes.SET_HISTORY:
      return { ...state, history: action.payload };

    case ActionTypes.UPDATE_MISTYPED_KEYS:
      const newMistypedKeys = { ...state.mistypedKeys };
      const key = action.payload;
      newMistypedKeys[key] = (newMistypedKeys[key] || 0) + 1;
      return { ...state, mistypedKeys: newMistypedKeys };

    case ActionTypes.SET_MISTYPED_KEYS:
      return { ...state, mistypedKeys: action.payload };

    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ActionTypes.RESET_SESSION:
      return {
        ...state,
        isSessionActive: false,
        sessionStartTime: null,
        currentStats: {
          wpm: 0,
          accuracy: 100,
          errors: 0,
          totalChars: 0,
          correctChars: 0,
        },
        results: null,
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved progress and theme on mount
  useEffect(() => {
    const savedData = loadProgress();
    if (savedData) {
      if (savedData.history) {
        dispatch({ type: ActionTypes.SET_HISTORY, payload: savedData.history });
      }
      if (savedData.mistypedKeys) {
        dispatch({ type: ActionTypes.SET_MISTYPED_KEYS, payload: savedData.mistypedKeys });
      }
      if (savedData.theme) {
        dispatch({ type: ActionTypes.SET_THEME, payload: savedData.theme });
      }
    }

    // Apply theme on mount
    const savedTheme = savedData?.theme || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Save progress whenever history or mistypedKeys change
  useEffect(() => {
    if (!state.isLoading) {
      saveProgress({
        history: state.history,
        mistypedKeys: state.mistypedKeys,
        theme: state.theme,
      });
    }
  }, [state.history, state.mistypedKeys, state.theme, state.isLoading]);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Action creators
  const actions = {
    setTheme: useCallback((theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    }, []),

    toggleTheme: useCallback(() => {
      dispatch({ type: ActionTypes.SET_THEME, payload: state.theme === 'light' ? 'dark' : 'light' });
    }, [state.theme]),

    setMode: useCallback((mode) => {
      dispatch({ type: ActionTypes.SET_MODE, payload: mode });
    }, []),

    setDifficulty: useCallback((difficulty) => {
      dispatch({ type: ActionTypes.SET_DIFFICULTY, payload: difficulty });
    }, []),

    setExercises: useCallback((exercises) => {
      dispatch({ type: ActionTypes.SET_EXERCISES, payload: exercises });
    }, []),

    setCurrentExercise: useCallback((exercise) => {
      dispatch({ type: ActionTypes.SET_CURRENT_EXERCISE, payload: exercise });
    }, []),

    startSession: useCallback(() => {
      dispatch({ type: ActionTypes.START_SESSION });
    }, []),

    endSession: useCallback(() => {
      dispatch({ type: ActionTypes.END_SESSION });
    }, []),

    updateStats: useCallback((stats) => {
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: stats });
    }, []),

    setResults: useCallback((results) => {
      dispatch({ type: ActionTypes.SET_RESULTS, payload: results });
    }, []),

    clearResults: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_RESULTS });
    }, []),

    addHistory: useCallback((session) => {
      dispatch({ type: ActionTypes.ADD_HISTORY, payload: session });
    }, []),

    recordMistypedKey: useCallback((key) => {
      dispatch({ type: ActionTypes.UPDATE_MISTYPED_KEYS, payload: key });
    }, []),

    setLoading: useCallback((loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    }, []),

    setError: useCallback((error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    }, []),

    resetSession: useCallback(() => {
      dispatch({ type: ActionTypes.RESET_SESSION });
    }, []),

    // Export/Import progress
    exportData: useCallback(() => {
      return exportProgress({
        history: state.history,
        mistypedKeys: state.mistypedKeys,
      });
    }, [state.history, state.mistypedKeys]),

    importData: useCallback((jsonString) => {
      const data = importProgress(jsonString);
      if (data) {
        if (data.history) {
          dispatch({ type: ActionTypes.SET_HISTORY, payload: data.history });
        }
        if (data.mistypedKeys) {
          dispatch({ type: ActionTypes.SET_MISTYPED_KEYS, payload: data.mistypedKeys });
        }
        return true;
      }
      return false;
    }, []),

    clearAllData: useCallback(() => {
      dispatch({ type: ActionTypes.SET_HISTORY, payload: [] });
      dispatch({ type: ActionTypes.SET_MISTYPED_KEYS, payload: {} });
      localStorage.removeItem('typing-trainer-progress');
    }, []),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
