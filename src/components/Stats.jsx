import React from 'react';

/**
 * Live statistics display component
 * Shows WPM, accuracy, and error count during typing
 */
function Stats({ wpm, accuracy, errors, correctCount, totalTyped, compact = false }) {
  const stats = [
    {
      label: 'WPM',
      value: wpm,
      format: (v) => Math.round(v),
      icon: '⚡',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Accuracy',
      value: accuracy,
      format: (v) => `${Math.round(v)}%`,
      icon: '🎯',
      color: accuracy >= 90 ? 'text-green-600 dark:text-green-400' :
        accuracy >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
          'text-red-600 dark:text-red-400',
    },
    {
      label: 'Errors',
      value: errors,
      format: (v) => v,
      icon: '❌',
      color: errors === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400">{stat.label}:</span>
            <span className={`font-bold ${stat.color}`}>{stat.format(stat.value)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center"
        >
          <div className="text-2xl mb-1" aria-hidden="true">{stat.icon}</div>
          <div className={`text-2xl sm:text-3xl font-bold ${stat.color} animate-count-up`}>
            {stat.format(stat.value)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stats;
