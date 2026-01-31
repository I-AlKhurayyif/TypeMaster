/**
 * Statistics calculation utilities for typing sessions
 */

/**
 * Calculate Words Per Minute (WPM)
 * Standard: 5 characters = 1 word
 * @param {number} correctChars - Number of correctly typed characters
 * @param {number} elapsedTimeMs - Elapsed time in milliseconds
 * @returns {number} WPM rounded to 1 decimal place
 */
export function calculateWPM(correctChars, elapsedTimeMs) {
  if (elapsedTimeMs <= 0) return 0;

  const words = correctChars / 5;
  const minutes = elapsedTimeMs / 60000;
  const wpm = words / minutes;

  return Math.round(wpm * 10) / 10;
}

/**
 * Calculate accuracy percentage
 * @param {number} correctChars - Number of correctly typed characters
 * @param {number} totalChars - Total characters typed
 * @returns {number} Accuracy percentage (0-100)
 */
export function calculateAccuracy(correctChars, totalChars) {
  if (totalChars <= 0) return 100;
  const accuracy = (correctChars / totalChars) * 100;
  return Math.round(accuracy * 10) / 10;
}

/**
 * Calculate error rate
 * @param {number} errors - Number of errors
 * @param {number} totalChars - Total characters typed
 * @returns {number} Error rate percentage
 */
export function calculateErrorRate(errors, totalChars) {
  if (totalChars <= 0) return 0;
  return Math.round((errors / totalChars) * 100 * 10) / 10;
}

/**
 * Get performance rating based on WPM and accuracy
 * @param {number} wpm - Words per minute
 * @param {number} accuracy - Accuracy percentage
 * @returns {Object} Rating object with label and color
 */
export function getPerformanceRating(wpm, accuracy) {
  if (accuracy >= 95 && wpm >= 60) {
    return { label: 'Excellent', color: 'text-green-500', emoji: '🌟' };
  }
  if (accuracy >= 90 && wpm >= 45) {
    return { label: 'Great', color: 'text-blue-500', emoji: '👍' };
  }
  if (accuracy >= 85 && wpm >= 30) {
    return { label: 'Good', color: 'text-yellow-500', emoji: '👌' };
  }
  if (accuracy >= 80 && wpm >= 20) {
    return { label: 'Fair', color: 'text-orange-500', emoji: '📈' };
  }
  return { label: 'Keep Practicing', color: 'text-red-500', emoji: '💪' };
}

/**
 * Get adaptive difficulty recommendation
 * @param {Array} recentSessions - Recent typing sessions (last 5-10)
 * @param {string} currentDifficulty - Current difficulty level
 * @returns {Object} Recommendation object
 */
export function getDifficultyRecommendation(recentSessions, currentDifficulty) {
  if (recentSessions.length < 3) {
    return {
      recommendation: 'continue',
      message: 'Complete more sessions to get personalized recommendations.',
      reason: 'Need more data',
    };
  }

  // Calculate average accuracy from recent sessions
  const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
  const avgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;

  const difficultyOrder = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
  const currentIndex = difficultyOrder.indexOf(currentDifficulty);

  // Strong performance - recommend moving up
  if (avgAccuracy >= 90 && avgWPM >= 40) {
    if (currentIndex < difficultyOrder.length - 1) {
      return {
        recommendation: 'increase',
        nextDifficulty: difficultyOrder[currentIndex + 1],
        message: `Great job! Your accuracy (${avgAccuracy.toFixed(1)}%) and speed (${avgWPM.toFixed(1)} WPM) are excellent. Consider trying ${difficultyOrder[currentIndex + 1]} difficulty.`,
        reason: 'High accuracy and speed',
      };
    } else {
      return {
        recommendation: 'continue',
        message: `Excellent work! You're performing great at the highest difficulty. Keep practicing to maintain your skills.`,
        reason: 'Already at highest level',
      };
    }
  }

  // Struggling - recommend staying or moving down
  if (avgAccuracy < 70) {
    if (currentIndex > 0) {
      return {
        recommendation: 'decrease',
        nextDifficulty: difficultyOrder[currentIndex - 1],
        message: `Your accuracy (${avgAccuracy.toFixed(1)}%) suggests this level may be challenging. Consider practicing at ${difficultyOrder[currentIndex - 1]} to build confidence.`,
        reason: 'Low accuracy',
      };
    } else {
      return {
        recommendation: 'continue',
        message: `Keep practicing! Focus on accuracy over speed. Take your time with each character.`,
        reason: 'At beginner level, needs more practice',
      };
    }
  }

  // Moderate performance - stay at current level
  return {
    recommendation: 'continue',
    message: `Good progress! Continue practicing at ${currentDifficulty} level. Aim for 90%+ accuracy before moving up.`,
    reason: 'Moderate performance',
  };
}

/**
 * Get the top N mistyped keys
 * @param {Object} mistypedKeys - Object mapping keys to error counts
 * @param {number} n - Number of top keys to return
 * @returns {Array} Array of {key, count} objects sorted by count descending
 */
export function getTopMistypedKeys(mistypedKeys, n = 10) {
  return Object.entries(mistypedKeys)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/**
 * Calculate statistics trends from history
 * @param {Array} history - Session history array
 * @param {number} limit - Number of recent sessions to analyze
 * @returns {Object} Trend data for charts
 */
export function calculateTrends(history, limit = 20) {
  const recentSessions = history.slice(0, limit).reverse();

  return {
    labels: recentSessions.map((s, i) => {
      const date = new Date(s.timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    wpmData: recentSessions.map(s => s.wpm),
    accuracyData: recentSessions.map(s => s.accuracy),
    sessions: recentSessions,
  };
}

/**
 * Get statistics summary from history
 * @param {Array} history - Session history array
 * @returns {Object} Summary statistics
 */
export function getStatsSummary(history) {
  if (history.length === 0) {
    return {
      totalSessions: 0,
      totalTime: 0,
      avgWPM: 0,
      avgAccuracy: 0,
      bestWPM: 0,
      bestAccuracy: 0,
      totalChars: 0,
      totalErrors: 0,
    };
  }

  const totalSessions = history.length;
  const totalChars = history.reduce((sum, s) => sum + s.totalChars, 0);
  const totalErrors = history.reduce((sum, s) => sum + s.errors, 0);
  const avgWPM = history.reduce((sum, s) => sum + s.wpm, 0) / totalSessions;
  const avgAccuracy = history.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions;
  const bestWPM = Math.max(...history.map(s => s.wpm));
  const bestAccuracy = Math.max(...history.map(s => s.accuracy));

  return {
    totalSessions,
    totalChars,
    totalErrors,
    avgWPM: Math.round(avgWPM * 10) / 10,
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    bestWPM: Math.round(bestWPM * 10) / 10,
    bestAccuracy: Math.round(bestAccuracy * 10) / 10,
  };
}
