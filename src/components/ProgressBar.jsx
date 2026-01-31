import React from 'react';

/**
 * Progress bar component for displaying typing progress
 */
function ProgressBar({ progress, label, color = 'blue', showPercentage = true }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-green-500',
  };

  const progressValue = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(progressValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
