/**
 * CSV Loader utility using PapaParse
 * Loads and parses the difficulty_level.csv file
 */

import Papa from 'papaparse';

/**
 * Load and parse the CSV file containing typing exercises
 * @param {string} csvPath - Path to the CSV file
 * @returns {Promise<Array>} Array of parsed exercise objects
 */
export async function loadExercises(csvPath = '/difficulty_level.csv') {
  return new Promise((resolve, reject) => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }

        // Transform and validate the data
        const exercises = results.data
          .filter(row => row.text && row.difficulty_level)
          .map((row, index) => ({
            id: index + 1,
            text: row.text,
            sourceFile: row.file || 'unknown',
            score: parseFloat(row.score) || 0,
            uniqueCharScore: parseFloat(row.unique_char_score) || 0,
            difficultyIndex: parseFloat(row.difficulty_index) || 0,
            difficulty: row.difficulty_level,
            exerciseId: parseInt(row.exercise_id) || index + 1,
          }));

        resolve(exercises);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      },
    });
  });
}

/**
 * Get exercises filtered by difficulty level
 * @param {Array} exercises - All exercises
 * @param {string} difficulty - Difficulty level to filter by
 * @returns {Array} Filtered exercises
 */
export function getExercisesByDifficulty(exercises, difficulty) {
  return exercises.filter(ex => ex.difficulty === difficulty);
}

/**
 * Get a random exercise for a given difficulty
 * @param {Array} exercises - All exercises
 * @param {string} difficulty - Difficulty level
 * @returns {Object|null} Random exercise or null if none found
 */
export function getRandomExercise(exercises, difficulty) {
  const filtered = getExercisesByDifficulty(exercises, difficulty);
  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Get available difficulty levels from exercises
 * @param {Array} exercises - All exercises
 * @returns {Array} Unique difficulty levels
 */
export function getDifficultyLevels(exercises) {
  const levels = [...new Set(exercises.map(ex => ex.difficulty))];

  // Sort by typical progression
  const order = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
  return levels.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}
