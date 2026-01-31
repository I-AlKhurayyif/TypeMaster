import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for countdown timer functionality
 * Used in Test Mode for timed typing tests
 */
export function useTimer(initialSeconds = 60) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  // Start the timer
  const start = useCallback(() => {
    if (isRunning || isFinished) return;
    setIsRunning(true);
  }, [isRunning, isFinished]);

  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset the timer
  const reset = useCallback((newTime = initialSeconds) => {
    pause();
    setTimeRemaining(newTime);
    setIsFinished(false);
  }, [pause, initialSeconds]);

  // Timer tick effect
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeRemaining,
    isRunning,
    isFinished,
    formattedTime: formatTime(timeRemaining),
    start,
    pause,
    reset,
    progress: ((initialSeconds - timeRemaining) / initialSeconds) * 100,
  };
}

export default useTimer;
