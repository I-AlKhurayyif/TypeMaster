import React from 'react';
import { useApp } from '../context/AppContext';

/**
 * Mode selector component for choosing between Learning and Test modes
 */
function ModeSelector({ onSelect }) {
  const { state } = useApp();

  const modes = [
    {
      id: 'learning',
      title: 'Learning Mode',
      description: 'Practice at your own pace with real-time feedback. Focus on accuracy, not speed.',
      icon: '📚',
      features: [
        'Real-time character feedback',
        'Backspace allowed',
        'No time pressure',
        'Focus on building muscle memory',
      ],
      color: 'blue',
    },
    {
      id: 'test',
      title: 'Test Mode',
      description: 'Timed typing test to measure your WPM and accuracy.',
      icon: '⏱️',
      features: [
        'Timed sessions (60 seconds)',
        'WPM & accuracy tracking',
        'Performance analysis',
        'Progress history saved',
      ],
      color: 'green',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
      icon: 'bg-blue-100 dark:bg-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      hoverBorder: 'hover:border-green-400 dark:hover:border-green-600',
      icon: 'bg-green-100 dark:bg-green-800',
      button: 'bg-green-600 hover:bg-green-700',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Choose Your Mode
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Select how you want to practice today
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modes.map((mode) => {
          const colors = colorClasses[mode.color];

          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={`
                group relative p-6 rounded-2xl border-2 text-left transition-all duration-200
                ${colors.bg} ${colors.border} ${colors.hoverBorder}
                hover:shadow-lg hover:scale-[1.02] focus:scale-[1.02]
              `}
              aria-label={`Select ${mode.title}`}
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl ${colors.icon} mb-4`}>
                <span className="text-3xl" aria-hidden="true">{mode.icon}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {mode.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {mode.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {mode.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Start button */}
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium
                ${colors.button} transition-colors
              `}>
                Start
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick stats preview */}
      {state.history.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-center text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {state.history.length}
            </span>{' '}
            sessions completed •{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.round(state.history.reduce((sum, s) => sum + s.wpm, 0) / state.history.length)} WPM
            </span>{' '}
            average
          </p>
        </div>
      )}
    </div>
  );
}

export default ModeSelector;
