import React from 'react';
import { useApp } from '../context/AppContext';
import { getDifficultyLevels } from '../utils/csvLoader';

/**
 * Difficulty selector component
 */
function DifficultySelector({ onSelect, onBack }) {
  const { state } = useApp();

  // Get available difficulty levels from loaded exercises
  const availableLevels = getDifficultyLevels(state.exercises);

  const difficultyInfo = {
    Beginner: {
      description: 'Basic home row keys. Perfect for those just starting out.',
      color: 'green',
      icon: '🌱',
    },
    Easy: {
      description: 'Home row with additional keys. Building foundational skills.',
      color: 'blue',
      icon: '📘',
    },
    Intermediate: {
      description: 'All letter keys with punctuation. Expanding your range.',
      color: 'yellow',
      icon: '📙',
    },
    Advanced: {
      description: 'Complex patterns and symbols. Mastering the keyboard.',
      color: 'orange',
      icon: '📕',
    },
    Expert: {
      description: 'Full keyboard with mixed case, numbers, and special characters.',
      color: 'red',
      icon: '🏆',
    },
  };

  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:border-green-500',
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:border-blue-500',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 hover:border-yellow-500',
    orange: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 hover:border-orange-500',
    red: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 hover:border-red-500',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        aria-label="Go back"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Difficulty
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a level that matches your current skill
        </p>
      </div>

      <div className="space-y-4">
        {availableLevels.map((level) => {
          const info = difficultyInfo[level] || {
            description: 'Practice exercises',
            color: 'blue',
            icon: '📝',
          };

          // Count exercises for this level
          const exerciseCount = state.exercises.filter(ex => ex.difficulty === level).length;

          // Get recent performance for this difficulty
          const recentSessions = state.history
            .filter(s => s.difficulty === level)
            .slice(0, 5);
          const avgAccuracy = recentSessions.length > 0
            ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length)
            : null;

          return (
            <button
              key={level}
              onClick={() => onSelect(level)}
              className={`
                w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200
                ${colorClasses[info.color]}
                hover:shadow-md hover:scale-[1.01]
              `}
              aria-label={`Select ${level} difficulty`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden="true">{info.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {level}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {exerciseCount} exercises
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {info.description}
                  </p>

                  {avgAccuracy !== null && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Your recent accuracy: <span className="font-semibold">{avgAccuracy}%</span>
                    </p>
                  )}
                </div>

                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DifficultySelector;
