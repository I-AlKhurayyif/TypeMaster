import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTypingSession } from '../hooks/useTypingSession';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import TypingArea from './TypingArea';
import Stats from './Stats';
import ProgressBar from './ProgressBar';
import Results from './Results';
import KeyboardVisualization2D from './KeyboardVisualization2D';

/**
 * Learning Mode screen - Practice focused typing with backspace support
 * Includes 2D keyboard and hands visualization
 */
function LearningMode({ onBack, onChangeExercise }) {
  const { state, actions } = useApp();
  const text = state.currentExercise?.text || '';
  const keyboardRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [showFingerColors, setShowFingerColors] = useState(true);

  const {
    currentIndex,
    typedChars,
    hasStarted,
    isComplete,
    elapsedTime,
    wpm,
    accuracy,
    errors,
    correctCount,
    totalTyped,
    handleKeyPress: originalHandleKeyPress,
    handleBackspace: originalHandleBackspace,
    reset,
    getCharStatus,
    progress,
  } = useTypingSession(text, 'learning');

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

  // Enhanced backspace handler
  const handleBackspace = useCallback(() => {
    originalHandleBackspace();
  }, [originalHandleBackspace]);

  // Handle keyboard input
  useKeyboardInput({
    onKeyPress: handleKeyPress,
    onBackspace: handleBackspace,
    enabled: !isComplete,
  });

  // Update hint for next character
  useEffect(() => {
    if (keyboardRef.current && text && !isComplete) {
      const nextChar = text[currentIndex];
      if (nextChar) {
        keyboardRef.current.highlightNextKey(nextChar);
      } else {
        keyboardRef.current.highlightNextKey(null);
      }
    }
  }, [currentIndex, text, isComplete]);

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

  // Save session to history when complete
  useEffect(() => {
    if (isComplete && totalTyped > 0) {
      actions.addHistory({
        timestamp: new Date().toISOString(),
        mode: 'learning',
        difficulty: state.difficulty,
        wpm,
        accuracy,
        totalChars: totalTyped,
        errors,
        exerciseId: state.currentExercise?.id,
      });

      // Clear hints
      if (keyboardRef.current) {
        keyboardRef.current.reset();
      }
    }
  }, [isComplete, totalTyped, wpm, accuracy, errors, state.difficulty, state.currentExercise?.id, actions]);

  // Handle restart
  const handleRestart = useCallback(() => {
    reset();
    if (keyboardRef.current) {
      keyboardRef.current.reset();
    }
  }, [reset]);

  // Handle new exercise
  const handleNewExercise = useCallback(() => {
    reset();
    if (keyboardRef.current) {
      keyboardRef.current.reset();
    }
    onChangeExercise();
  }, [reset, onChangeExercise]);

  // Handle change mode
  const handleChangeMode = useCallback(() => {
    reset();
    if (keyboardRef.current) {
      keyboardRef.current.reset();
    }
    onBack();
  }, [reset, onBack]);

  // Show results when complete
  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Results
          wpm={wpm}
          accuracy={accuracy}
          errors={errors}
          totalChars={totalTyped}
          correctChars={correctCount}
          elapsedTime={elapsedTime}
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
              Learning Mode
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {state.difficulty} • Exercise {state.currentExercise?.exerciseId}
            </p>
          </div>
        </div>

        {/* Controls */}
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

          <button
            onClick={handleRestart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Restart exercise"
            aria-label="Restart exercise"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleNewExercise}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="New exercise"
            aria-label="Get new exercise"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar progress={progress} label="Progress" color="gradient" />
      </div>

      {/* Live stats (compact) */}
      {hasStarted && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Stats
            wpm={wpm}
            accuracy={accuracy}
            errors={errors}
            correctCount={correctCount}
            totalTyped={totalTyped}
            compact
          />
        </div>
      )}

      {/* Typing area */}
      <div className="mb-4">
        <TypingArea
          text={text}
          getCharStatus={getCharStatus}
          currentIndex={currentIndex}
          isComplete={isComplete}
          mode="learning"
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
          Type the text above. <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Backspace</kbd> to correct mistakes.
          {showKeyboard && ' Watch the highlighted keys and fingers for proper placement.'}
        </p>
      </div>
    </div>
  );
}

export default LearningMode;
