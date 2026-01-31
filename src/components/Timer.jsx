import React from 'react';

/**
 * Timer component for Test Mode
 * Displays countdown timer with visual indicator
 */
function Timer({ timeRemaining, formattedTime, isRunning, isFinished }) {
  // Calculate color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-500 dark:text-red-400';
    if (timeRemaining <= 30) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-gray-900 dark:text-white';
  };

  // Calculate ring progress
  const totalTime = 60; // Default test duration
  const progress = (timeRemaining / totalTime) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Circular timer */}
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            className={`${getTimerColor()} transition-all duration-1000`}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-2xl font-bold font-mono ${getTimerColor()}`}
            aria-live="polite"
            aria-label={`Time remaining: ${formattedTime}`}
          >
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-2 text-sm">
        {isFinished ? (
          <span className="text-red-500 font-medium">Time's up!</span>
        ) : isRunning ? (
          <span className="text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Running
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Ready</span>
        )}
      </div>
    </div>
  );
}

export default Timer;
