import React, { useRef, useEffect, useMemo, memo } from 'react';

/**
 * Optimized character component to prevent unnecessary re-renders
 */
const Character = memo(function Character({ char, status, index }) {
  const statusClasses = {
    correct: 'text-green-600 dark:text-green-400',
    incorrect: 'text-white bg-red-500 dark:bg-red-600 rounded px-0.5',
    current: 'bg-blue-500 text-white rounded px-0.5 animate-pulse',
    pending: 'text-gray-500 dark:text-gray-400',
  };

  // Handle special characters for display
  let displayChar = char;
  if (char === ' ') {
    displayChar = '\u00A0'; // Non-breaking space
  } else if (char === '\n') {
    displayChar = '↵'; // Show enter symbol
  }

  return (
    <span
      className={`${statusClasses[status]} transition-colors duration-75 inline`}
      data-index={index}
      aria-label={status === 'current' ? `Current character: ${char === ' ' ? 'space' : char}` : undefined}
    >
      {displayChar}
    </span>
  );
});

/**
 * Word wrapper to keep words together and allow line breaks
 */
const Word = memo(function Word({ characters, startIndex, getCharStatus }) {
  return (
    <span className="inline whitespace-nowrap">
      {characters.map((char, idx) => (
        <Character
          key={startIndex + idx}
          char={char}
          status={getCharStatus(startIndex + idx)}
          index={startIndex + idx}
        />
      ))}
    </span>
  );
});

/**
 * Main typing area component
 * Displays text in a multi-line paragraph format with per-character highlighting
 */
function TypingArea({ text, getCharStatus, currentIndex, isComplete, mode }) {
  const containerRef = useRef(null);
  const currentCharRef = useRef(null);

  // Split text into words for better line wrapping
  const words = useMemo(() => {
    if (!text) return [];

    const result = [];
    let currentWord = [];
    let wordStartIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === ' ' || char === '\n') {
        if (currentWord.length > 0) {
          result.push({
            chars: currentWord,
            startIndex: wordStartIndex,
          });
        }
        // Add space/newline as its own "word"
        result.push({
          chars: [char],
          startIndex: i,
          isSpace: true,
          isNewline: char === '\n',
        });
        currentWord = [];
        wordStartIndex = i + 1;
      } else {
        currentWord.push(char);
      }
    }

    // Don't forget the last word
    if (currentWord.length > 0) {
      result.push({
        chars: currentWord,
        startIndex: wordStartIndex,
      });
    }

    return result;
  }, [text]);

  // Calculate which line the current character is on and scroll if needed
  useEffect(() => {
    if (containerRef.current) {
      // Find the current character element
      const currentEl = containerRef.current.querySelector(`[data-index="${currentIndex}"]`);
      if (currentEl) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const charRect = currentEl.getBoundingClientRect();

        // Check if character is outside visible area
        if (charRect.top < containerRect.top + 20 || charRect.bottom > containerRect.bottom - 20) {
          currentEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }
  }, [currentIndex]);

  if (!text) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        Loading exercise...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`
        relative p-6 rounded-xl border-2 
        ${isComplete
          ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }
        min-h-[120px] max-h-[200px] overflow-y-auto
        font-mono text-lg sm:text-xl leading-relaxed
        select-none
      `}
      role="textbox"
      aria-label="Typing area"
      aria-readonly="true"
      tabIndex={0}
    >
      {/* Instruction overlay when not started */}
      {currentIndex === 0 && !isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-xl z-10">
          <p className="text-gray-500 dark:text-gray-400 text-center px-4">
            <span className="block text-lg font-medium mb-1">Ready to type?</span>
            <span className="text-sm">Start typing to begin{mode === 'test' ? ' the timer' : ''}</span>
          </p>
        </div>
      )}

      {/* Text with word-based wrapping and character highlighting */}
      <div className="relative leading-[2] whitespace-pre-wrap break-words">
        {words.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            {word.isNewline ? (
              <>
                <Character
                  char={'\n'}
                  status={getCharStatus(word.startIndex)}
                  index={word.startIndex}
                />
                <br />
              </>
            ) : word.isSpace ? (
              <span className="inline">
                <Character
                  char=" "
                  status={getCharStatus(word.startIndex)}
                  index={word.startIndex}
                />
              </span>
            ) : (
              <Word
                characters={word.chars}
                startIndex={word.startIndex}
                getCharStatus={getCharStatus}
              />
            )}
            {/* Add a zero-width space after each word to allow line breaks */}
            {!word.isNewline && <wbr />}
          </React.Fragment>
        ))}
      </div>

      {/* Completion indicator */}
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-50/95 dark:bg-green-900/80 rounded-xl">
          <div className="text-center">
            <span className="text-5xl mb-3 block" aria-hidden="true">🎉</span>
            <p className="text-green-700 dark:text-green-300 font-semibold text-lg">
              Exercise Complete!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TypingArea);
