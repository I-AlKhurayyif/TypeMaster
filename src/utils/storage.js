/**
 * LocalStorage utility functions for progress tracking
 * Handles saving, loading, exporting, and importing user progress data
 */

const STORAGE_KEY = 'typing-trainer-progress';

/**
 * Load progress data from localStorage
 * @returns {Object|null} Saved progress data or null if not found
 */
export function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return null;
}

/**
 * Save progress data to localStorage
 * @param {Object} data - Progress data to save
 */
export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Export progress data as a JSON string for download
 * @param {Object} data - Progress data to export
 * @returns {string} JSON string of progress data
 */
export function exportProgress(data) {
  try {
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting progress:', error);
    return null;
  }
}

/**
 * Import progress data from a JSON string
 * @param {string} jsonString - JSON string containing progress data
 * @returns {Object|null} Parsed progress data or null if invalid
 */
export function importProgress(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    // Validate the imported data structure
    if (data && typeof data === 'object') {
      // Ensure history is an array
      if (data.history && !Array.isArray(data.history)) {
        console.error('Invalid history format');
        return null;
      }

      // Ensure mistypedKeys is an object
      if (data.mistypedKeys && typeof data.mistypedKeys !== 'object') {
        console.error('Invalid mistypedKeys format');
        return null;
      }

      return {
        history: data.history || [],
        mistypedKeys: data.mistypedKeys || {},
      };
    }
  } catch (error) {
    console.error('Error importing progress:', error);
  }
  return null;
}

/**
 * Download progress data as a JSON file
 * @param {Object} data - Progress data to download
 */
export function downloadProgress(data) {
  const jsonString = exportProgress(data);
  if (!jsonString) return;

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const timestamp = new Date().toISOString().split('T')[0];
  link.download = `typing-progress-${timestamp}.json`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Clear all stored progress data
 */
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
}
