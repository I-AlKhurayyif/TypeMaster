import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  getPerformanceRating,
  getDifficultyRecommendation
} from '../utils/statsCalculator';

/**
 * Results component displayed after completing a typing session
 * Shows detailed statistics and recommendations
 */
function Results({ wpm, accuracy, errors, totalChars, correctChars, elapsedTime, onRestart, onNewExercise, onChangeMode }) {
  const { state } = useApp();

  // Calculate performance rating
  const rating = useMemo(() => getPerformanceRating(wpm, accuracy), [wpm, accuracy]);

  // Get difficulty recommendation based on recent history
  const recentSessions = useMemo(() =>
    state.history.filter(s => s.difficulty === state.difficulty).slice(0, 5),
    [state.history, state.difficulty]
  );

  const recommendation = useMemo(() =>
    getDifficultyRecommendation(recentSessions, state.difficulty),
    [recentSessions, state.difficulty]
  );

  // Format elapsed time
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with rating */}
      <div className="text-center mb-8">
        <span className="text-6xl mb-4 block" aria-hidden="true">{rating.emoji}</span>
        <h2 className={`text-3xl font-bold ${rating.color} mb-2`}>
          {rating.label}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {state.mode === 'test' ? 'Test' : 'Practice'} Complete
        </p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(wpm)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl text-center">
          <div className={`text-3xl font-bold ${accuracy >= 90 ? 'text-green-600 dark:text-green-400' :
              accuracy >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
            }`}>
            {accuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {errors}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
        </div>
      </div>

      {/* Detailed stats */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Characters typed</span>
            <span className="font-medium text-gray-900 dark:text-white">{totalChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Correct characters</span>
            <span className="font-medium text-green-600 dark:text-green-400">{correctChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
            <span className="font-medium text-gray-900 dark:text-white">{state.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Mode</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">{state.mode}</span>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`rounded-xl p-4 mb-8 ${recommendation.recommendation === 'increase'
          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
          : recommendation.recommendation === 'decrease'
            ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
            : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
        }`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">
            {recommendation.recommendation === 'increase' ? '📈' :
              recommendation.recommendation === 'decrease' ? '📚' : '💪'}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Recommendation
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {recommendation.message}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onNewExercise}
          className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
        >
          New Exercise
        </button>
        <button
          onClick={onChangeMode}
          className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
        >
          Change Mode
        </button>
      </div>
    </div>
  );
}

export default Results;
