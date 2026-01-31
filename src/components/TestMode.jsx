import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTypingSession } from '../hooks/useTypingSession';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { useTimer } from '../hooks/useTimer';
import TypingArea from './TypingArea';
import Stats from './Stats';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import Results from './Results';
import KeyboardVisualization2D from './KeyboardVisualization2D';

/**
 * Test Mode screen - Timed typing test with no backspace
 * Includes 2D keyboard and hands visualization
 */
function TestMode({ onBack, onChangeExercise }) {
  const { state, actions } = useApp();
  const text = state.currentExercise?.text || '';
  const keyboardRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [showFingerColors, setShowFingerColors] = useState(true);

  // Test duration in seconds
  const TEST_DURATION = 60;

  const timer = useTimer(TEST_DURATION);
  const [showResults, setShowResults] = useState(false);

  const {
    currentIndex,
    hasStarted,
    isComplete,
    elapsedTime,
    wpm,
    accuracy,
    errors,
    correctCount,
    totalTyped,
    handleKeyPress: originalHandleKeyPress,
    reset: resetTyping,
    getCharStatus,
    progress,
  } = useTypingSession(text, 'test');

  // Enhanced key press handler with visualization
  const handleKeyPress = useCallback((key) => {
    // Press animation
    if (keyboardRef.current) {
      keyboardRef.current.pressKey(key);

      // Release after a short delay
      setTimeout(() => {
        if (keyboardRef.current) {
          keyboardRef.current.releaseKey(key);
        }
      }, 150);
    }

    originalHandleKeyPress(key);
  }, [originalHandleKeyPress]);

  // Handle keyboard input - no backspace in test mode
  useKeyboardInput({
    onKeyPress: handleKeyPress,
    enabled: !isComplete && !timer.isFinished && !showResults,
  });

  // Update hint for next character
  useEffect(() => {
    if (keyboardRef.current && text && !isComplete && !timer.isFinished) {
      const nextChar = text[currentIndex];
      if (nextChar) {
        keyboardRef.current.highlightNextKey(nextChar);
      } else {
        keyboardRef.current.highlightNextKey(null);
      }
    }
  }, [currentIndex, text, isComplete, timer.isFinished]);

  // Reset keyboard when session resets
  useEffect(() => {
    if (currentIndex === 0 && keyboardRef.current) {
      keyboardRef.current.reset();
      // Highlight first character
      if (text && text[0]) {
        keyboardRef.current.highlightNextKey(text[0]);
      }
    }
  }, [currentIndex, text]);

  // Start timer when typing begins
  useEffect(() => {
    if (hasStarted && !timer.isRunning && !timer.isFinished) {
      timer.start();
    }
  }, [hasStarted, timer]);

  // Save session and show results when timer finishes or exercise completes
  useEffect(() => {
    if ((timer.isFinished || isComplete) && hasStarted && !showResults) {
      // Save to history
      actions.addHistory({
        timestamp: new Date().toISOString(),
        mode: 'test',
        difficulty: state.difficulty,
        wpm,
        accuracy,
        totalChars: totalTyped,
        errors,
        exerciseId: state.currentExercise?.id,
        duration: timer.isFinished ? TEST_DURATION * 1000 : elapsedTime,
      });

      // Clear hints
      if (keyboardRef.current) {
        keyboardRef.current.reset();
      }

      setShowResults(true);
    }
  }, [timer.isFinished, isComplete, hasStarted, showResults, wpm, accuracy, totalTyped, errors, elapsedTime, state.difficulty, state.currentExercise?.id, actions]);

  // Handle restart
  const handleRestart = useCallback(() => {
    resetTyping();
    timer.reset(TEST_DURATION);
    setShowResults(false);
    if (keyboardRef.current) {
      keyboardRef.current.reset();
    }
  }, [resetTyping, timer]);

  // Handle new exercise
  const handleNewExercise = useCallback(() => {
    resetTyping();
    timer.reset(TEST_DURATION);
    setShowResults(false);
    if (keyboardRef.current) {
      keyboardRef.current.reset();
    }
    onChangeExercise();
  }, [resetTyping, timer, onChangeExercise]);

  // Handle change mode
  const handleChangeMode = useCallback(() => {
    resetTyping();
    timer.reset(TEST_DURATION);
    setShowResults(false);
    if (keyboardRef.current) {
      keyboardRef.current.reset();
    }
    onBack();
  }, [resetTyping, timer, onBack]);

  // Show results
  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Results
          wpm={wpm}
          accuracy={accuracy}
          errors={errors}
          totalChars={totalTyped}
          correctChars={correctCount}
          elapsedTime={timer.isFinished ? TEST_DURATION * 1000 : elapsedTime}
          onRestart={handleRestart}
          onNewExercise={handleNewExercise}
          onChangeMode={handleChangeMode}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Test Mode
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {state.difficulty} • {TEST_DURATION} second test
            </p>
          </div>
        </div>

        {/* Timer and Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle keyboard */}
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${showKeyboard
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            title={showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
          >
            Keyboard
          </button>

          {/* Toggle hands */}
          {showKeyboard && (
            <button
              onClick={() => setShowHands(!showHands)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${showHands
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              title={showHands ? 'Hide hands' : 'Show hands'}
            >
              Hands
            </button>
          )}

          {/* Toggle finger colors */}
          {showKeyboard && (
            <button
              onClick={() => setShowFingerColors(!showFingerColors)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${showFingerColors
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              title={showFingerColors ? 'Hide finger colors' : 'Show finger colors'}
            >
              Colors
            </button>
          )}

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Timer
            timeRemaining={timer.timeRemaining}
            formattedTime={timer.formattedTime}
            isRunning={timer.isRunning}
            isFinished={timer.isFinished}
          />
        </div>
      </div>

      {/* Live stats */}
      <div className="mb-4">
        <Stats
          wpm={wpm}
          accuracy={accuracy}
          errors={errors}
          correctCount={correctCount}
          totalTyped={totalTyped}
        />
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar
          progress={progress}
          label="Text Progress"
          color="gradient"
        />
      </div>

      {/* Typing area */}
      <div className="mb-4">
        <TypingArea
          text={text}
          getCharStatus={getCharStatus}
          currentIndex={currentIndex}
          isComplete={isComplete || timer.isFinished}
          mode="test"
        />
      </div>

      {/* 2D Keyboard and Hands Visualization */}
      {showKeyboard && (
        <div className="mt-4">
          <KeyboardVisualization2D
            ref={keyboardRef}
            showHints={true}
            showFingerColors={showFingerColors}
            showHands={showHands}
          />
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Type as fast and accurately as you can. No backspace allowed in test mode.
          {showKeyboard && ' The highlighted keys and fingers show proper placement.'}
        </p>
      </div>
    </div>
  );
}

export default TestMode;
