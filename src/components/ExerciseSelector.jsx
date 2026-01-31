import React, { useMemo } from 'react';

/**
 * Exercise Selector Component
 * Shows exercises with their unique character sets for selection
 */
function ExerciseSelector({ exercises, onSelect, onBack, difficulty }) {
  // Group exercises by difficulty and extract unique characters
  const exerciseOptions = useMemo(() => {
    return exercises.map((exercise) => {
      // Get unique characters from the text (excluding spaces for display)
      const chars = exercise.text.split('');
      const uniqueChars = [...new Set(chars)]
        .filter(c => c !== ' ') // Remove space from display
        .sort((a, b) => {
          // Sort: lowercase letters, uppercase letters, numbers, symbols
          const aLower = a.toLowerCase();
          const bLower = b.toLowerCase();
          const aIsLetter = /[a-z]/i.test(a);
          const bIsLetter = /[a-z]/i.test(b);
          const aIsNumber = /[0-9]/.test(a);
          const bIsNumber = /[0-9]/.test(b);

          if (aIsLetter && !bIsLetter) return -1;
          if (!aIsLetter && bIsLetter) return 1;
          if (aIsNumber && !bIsNumber) return -1;
          if (!aIsNumber && bIsNumber) return 1;

          return aLower.localeCompare(bLower);
        });

      // Categorize characters
      const letters = uniqueChars.filter(c => /[a-zA-Z]/.test(c));
      const numbers = uniqueChars.filter(c => /[0-9]/.test(c));
      const symbols = uniqueChars.filter(c => !/[a-zA-Z0-9]/.test(c));

      // Check if text contains spaces
      const hasSpaces = exercise.text.includes(' ');

      return {
        ...exercise,
        uniqueChars,
        letters,
        numbers,
        symbols,
        hasSpaces,
        charCount: uniqueChars.length,
        textLength: exercise.text.length,
      };
    });
  }, [exercises]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        aria-label="Go back"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Difficulty
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select Exercise
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {difficulty} level • {exerciseOptions.length} exercises available
        </p>
      </div>

      {/* Exercise list */}
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {exerciseOptions.map((exercise, index) => (
          <button
            key={exercise.id || index}
            onClick={() => onSelect(exercise)}
            className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                       hover:border-blue-400 dark:hover:border-blue-500 
                       bg-white dark:bg-gray-800 
                       hover:bg-blue-50 dark:hover:bg-blue-900/20
                       text-left transition-all duration-150 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Exercise number */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 
                                   text-gray-600 dark:text-gray-400 rounded">
                    #{exercise.exerciseId || index + 1}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {exercise.textLength} characters
                  </span>
                  {exercise.hasSpaces && (
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      • includes spaces
                    </span>
                  )}
                </div>

                {/* Unique characters display */}
                <div className="space-y-2">
                  {/* Letters */}
                  {exercise.letters.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-500 w-14">Letters:</span>
                      <div className="flex flex-wrap gap-1">
                        {exercise.letters.map((char, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center w-6 h-6 
                                       text-sm font-mono font-semibold
                                       bg-blue-100 dark:bg-blue-900/40 
                                       text-blue-700 dark:text-blue-300 
                                       rounded border border-blue-200 dark:border-blue-800"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Numbers */}
                  {exercise.numbers.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-500 w-14">Numbers:</span>
                      <div className="flex flex-wrap gap-1">
                        {exercise.numbers.map((char, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center w-6 h-6 
                                       text-sm font-mono font-semibold
                                       bg-green-100 dark:bg-green-900/40 
                                       text-green-700 dark:text-green-300 
                                       rounded border border-green-200 dark:border-green-800"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symbols */}
                  {exercise.symbols.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-500 w-14">Symbols:</span>
                      <div className="flex flex-wrap gap-1">
                        {exercise.symbols.map((char, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center w-6 h-6 
                                       text-sm font-mono font-semibold
                                       bg-purple-100 dark:bg-purple-900/40 
                                       text-purple-700 dark:text-purple-300 
                                       rounded border border-purple-200 dark:border-purple-800"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow icon */}
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 
                           group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Random exercise button */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * exerciseOptions.length);
            onSelect(exerciseOptions[randomIndex]);
          }}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600
                     text-white font-medium text-center transition-all"
        >
          🎲 Pick Random Exercise
        </button>
      </div>
    </div>
  );
}

export default ExerciseSelector;
