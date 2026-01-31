import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { loadExercises, getExercisesByDifficulty } from './utils/csvLoader';

// Components
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import DifficultySelector from './components/DifficultySelector';
import ExerciseSelector from './components/ExerciseSelector';
import LearningMode from './components/LearningMode';
import TestMode from './components/TestMode';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

/**
 * Main App component
 * Handles routing between different views and loading exercises
 */
function App() {
  const { state, actions } = useApp();

  // View states: 'home', 'difficulty', 'exercise', 'typing', 'analytics', 'settings'
  const [view, setView] = useState('home');
  const [error, setError] = useState(null);
  const [filteredExercises, setFilteredExercises] = useState([]);

  // Load exercises from CSV on mount
  useEffect(() => {
    async function init() {
      try {
        const exercises = await loadExercises('/difficulty_level.csv');
        actions.setExercises(exercises);
      } catch (err) {
        console.error('Failed to load exercises:', err);
        setError('Failed to load exercises. Please make sure difficulty_level.csv is in the public folder.');
        actions.setLoading(false);
      }
    }
    init();
  }, [actions]);

  // Handle mode selection
  const handleModeSelect = useCallback((mode) => {
    actions.setMode(mode);
    setView('difficulty');
  }, [actions]);

  // Handle difficulty selection - now goes to exercise selector
  const handleDifficultySelect = useCallback((difficulty) => {
    actions.setDifficulty(difficulty);
    const exercisesForDifficulty = getExercisesByDifficulty(state.exercises, difficulty);
    setFilteredExercises(exercisesForDifficulty);
    setView('exercise');
  }, [state.exercises, actions]);

  // Handle exercise selection
  const handleExerciseSelect = useCallback((exercise) => {
    actions.setCurrentExercise(exercise);
    setView('typing');
  }, [actions]);

  // Handle navigation
  const handleNavigate = useCallback((destination) => {
    if (destination === 'home') {
      actions.setMode(null);
      actions.setCurrentExercise(null);
      setView('home');
    } else {
      setView(destination);
    }
  }, [actions]);

  // Handle back from difficulty selector
  const handleBackFromDifficulty = useCallback(() => {
    actions.setMode(null);
    setView('home');
  }, [actions]);

  // Handle back from exercise selector
  const handleBackFromExercise = useCallback(() => {
    setView('difficulty');
  }, []);

  // Handle back from typing screen
  const handleBackFromTyping = useCallback(() => {
    actions.setCurrentExercise(null);
    actions.resetSession();
    setView('exercise');
  }, [actions]);

  // Handle new exercise selection (from typing screen)
  const handleChangeExercise = useCallback(() => {
    actions.setCurrentExercise(null);
    actions.resetSession();
    setView('exercise');
  }, [actions]);

  // Loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading exercises...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Exercises
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render current view
  const renderView = () => {
    switch (view) {
      case 'home':
        return <ModeSelector onSelect={handleModeSelect} />;

      case 'difficulty':
        return (
          <DifficultySelector
            onSelect={handleDifficultySelect}
            onBack={handleBackFromDifficulty}
          />
        );

      case 'exercise':
        return (
          <ExerciseSelector
            exercises={filteredExercises}
            difficulty={state.difficulty}
            onSelect={handleExerciseSelect}
            onBack={handleBackFromExercise}
          />
        );

      case 'typing':
        if (state.mode === 'learning') {
          return (
            <LearningMode
              onBack={handleBackFromTyping}
              onChangeExercise={handleChangeExercise}
            />
          );
        }
        return (
          <TestMode
            onBack={handleBackFromTyping}
            onChangeExercise={handleChangeExercise}
          />
        );

      case 'analytics':
        return <Analytics />;

      case 'settings':
        return <Settings />;

      default:
        return <ModeSelector onSelect={handleModeSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onNavigate={handleNavigate} currentView={view} />
      <main className="pb-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
