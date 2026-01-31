import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import {
  calculateTrends,
  getStatsSummary,
  getTopMistypedKeys,
} from '../utils/statsCalculator';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Analytics dashboard component
 * Displays charts and statistics from typing history
 */
function Analytics() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  // Chart colors based on theme
  const chartColors = {
    wpm: isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)', // blue
    wpmBg: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
    accuracy: isDark ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)', // green
    accuracyBg: isDark ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)',
    errors: isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)', // red
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    text: isDark ? '#9ca3af' : '#6b7280',
  };

  // Calculate trends data
  const trends = useMemo(() => calculateTrends(state.history, 20), [state.history]);

  // Get summary statistics
  const summary = useMemo(() => getStatsSummary(state.history), [state.history]);

  // Get top mistyped keys
  const mistypedKeys = useMemo(
    () => getTopMistypedKeys(state.mistypedKeys, 10),
    [state.mistypedKeys]
  );

  // WPM trend chart data
  const wpmChartData = {
    labels: trends.labels,
    datasets: [
      {
        label: 'WPM',
        data: trends.wpmData,
        borderColor: chartColors.wpm,
        backgroundColor: chartColors.wpmBg,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Accuracy trend chart data
  const accuracyChartData = {
    labels: trends.labels,
    datasets: [
      {
        label: 'Accuracy %',
        data: trends.accuracyData,
        borderColor: chartColors.accuracy,
        backgroundColor: chartColors.accuracyBg,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Mistyped keys chart data
  const mistypedChartData = {
    labels: mistypedKeys.map((k) => k.key === ' ' ? 'Space' : k.key),
    datasets: [
      {
        label: 'Error Count',
        data: mistypedKeys.map((k) => k.count),
        backgroundColor: chartColors.errors,
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#9ca3af' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          color: chartColors.text,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          color: chartColors.text,
        },
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    ...lineChartOptions,
    indexAxis: 'y',
    scales: {
      ...lineChartOptions.scales,
      x: {
        ...lineChartOptions.scales.x,
        beginAtZero: true,
      },
      y: {
        ...lineChartOptions.scales.y,
        ticks: {
          ...lineChartOptions.scales.y.ticks,
          font: {
            family: 'monospace',
            size: 14,
          },
        },
      },
    },
  };

  // No data state
  if (state.history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Analytics
        </h1>
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block" aria-hidden="true">📊</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Data Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete some typing sessions to see your analytics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Analytics Dashboard
      </h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.totalSessions}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Best WPM</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summary.bestWPM}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Accuracy</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {summary.avgAccuracy}%
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Chars</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {summary.totalChars.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* WPM Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            WPM Trend
          </h3>
          <div className="chart-container">
            <Line data={wpmChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Accuracy Trend
          </h3>
          <div className="chart-container">
            <Line data={accuracyChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Mistyped Keys */}
      {mistypedKeys.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Mistyped Keys
          </h3>
          <div className="chart-container">
            <Bar data={mistypedChartData} options={barChartOptions} />
          </div>
        </div>
      )}

      {/* Recent sessions table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Sessions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Mode</th>
                <th className="pb-3 font-medium">Difficulty</th>
                <th className="pb-3 font-medium text-right">WPM</th>
                <th className="pb-3 font-medium text-right">Accuracy</th>
                <th className="pb-3 font-medium text-right">Errors</th>
              </tr>
            </thead>
            <tbody>
              {state.history.slice(0, 10).map((session, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <td className="py-3 text-gray-900 dark:text-white">
                    {new Date(session.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 capitalize text-gray-600 dark:text-gray-400">
                    {session.mode}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {session.difficulty}
                  </td>
                  <td className="py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                    {Math.round(session.wpm)}
                  </td>
                  <td className={`py-3 text-right font-medium ${session.accuracy >= 90 ? 'text-green-600 dark:text-green-400' :
                      session.accuracy >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                    }`}>
                    {session.accuracy.toFixed(1)}%
                  </td>
                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                    {session.errors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
