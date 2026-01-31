import { useState, useCallback, useRef, useEffect } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/statsCalculator';
import { useApp } from '../context/AppContext';

/**
 * Custom hook for managing typing session state and logic
 * Handles character-by-character typing validation and stats calculation
 */
export function useTypingSession(text, mode = 'learning') {
  const { state, actions } = useApp();

  // Track current position in the text
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track typed characters and their correctness
  const [typedChars, setTypedChars] = useState([]);

  // Track if session has started (first key pressed)
  const [hasStarted, setHasStarted] = useState(false);

  // Track if session is complete
  const [isComplete, setIsComplete] = useState(false);

  // Timer for WPM calculation
  const startTimeRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Stats
  const [errors, setErrors] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Reset the session
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setTypedChars([]);
    setHasStarted(false);
    setIsComplete(false);
    setElapsedTime(0);
    setErrors(0);
    setCorrectCount(0);
    startTimeRef.current = null;
    actions.resetSession();
  }, [actions]);

  // Handle keypress
  const handleKeyPress = useCallback((key) => {
    if (isComplete || !text) return;

    // Start session on first keypress
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
      actions.startSession();
    }

    const expectedChar = text[currentIndex];
    const isCorrect = key === expectedChar;

    // Record the typed character
    setTypedChars(prev => [...prev, { char: key, expected: expectedChar, correct: isCorrect }]);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setErrors(prev => prev + 1);
      // Record mistyped key for analytics
      actions.recordMistypedKey(expectedChar);
    }

    // Move to next character
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // Check if complete
    if (nextIndex >= text.length) {
      setIsComplete(true);
      actions.endSession();
    }
  }, [currentIndex, text, hasStarted, isComplete, actions]);

  // Handle backspace (only in learning mode)
  const handleBackspace = useCallback(() => {
    if (mode !== 'learning' || currentIndex === 0) return;

    setCurrentIndex(prev => prev - 1);
    setTypedChars(prev => prev.slice(0, -1));

    // Adjust error count if the removed character was an error
    const lastTyped = typedChars[typedChars.length - 1];
    if (lastTyped && !lastTyped.correct) {
      setErrors(prev => Math.max(0, prev - 1));
    } else if (lastTyped && lastTyped.correct) {
      setCorrectCount(prev => Math.max(0, prev - 1));
    }
  }, [mode, currentIndex, typedChars]);

  // Update elapsed time
  useEffect(() => {
    let intervalId;

    if (hasStarted && !isComplete) {
      intervalId = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [hasStarted, isComplete]);

  // Calculate current stats
  const totalTyped = typedChars.length;
  const wpm = calculateWPM(correctCount, elapsedTime);
  const accuracy = calculateAccuracy(correctCount, totalTyped);

  // Update context stats
  useEffect(() => {
    if (hasStarted) {
      actions.updateStats({
        wpm,
        accuracy,
        errors,
        totalChars: totalTyped,
        correctChars: correctCount,
      });
    }
  }, [wpm, accuracy, errors, totalTyped, correctCount, hasStarted, actions]);

  // Get character status for rendering
  const getCharStatus = useCallback((index) => {
    if (index < typedChars.length) {
      return typedChars[index].correct ? 'correct' : 'incorrect';
    }
    if (index === currentIndex) {
      return 'current';
    }
    return 'pending';
  }, [typedChars, currentIndex]);

  return {
    // State
    currentIndex,
    typedChars,
    hasStarted,
    isComplete,
    elapsedTime,

    // Stats
    wpm,
    accuracy,
    errors,
    correctCount,
    totalTyped,

    // Actions
    handleKeyPress,
    handleBackspace,
    reset,
    getCharStatus,

    // Progress
    progress: text ? (currentIndex / text.length) * 100 : 0,
  };
}

export default useTypingSession;
