import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { downloadProgress } from '../utils/storage';

/**
 * Settings page component
 * Handles data export/import and app preferences
 */
function Settings() {
  const { state, actions } = useApp();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Handle export
  const handleExport = () => {
    downloadProgress({
      history: state.history,
      mistypedKeys: state.mistypedKeys,
    });
  };

  // Handle import click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = actions.importData(text);

      if (success) {
        setImportStatus({ type: 'success', message: 'Data imported successfully!' });
      } else {
        setImportStatus({ type: 'error', message: 'Invalid file format. Please use a valid export file.' });
      }
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Error reading file. Please try again.' });
    }

    // Reset file input
    event.target.value = '';

    // Clear status after 3 seconds
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Handle clear all data
  const handleClearData = () => {
    actions.clearAllData();
    setShowConfirmClear(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      {/* Theme preference */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Theme
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose between light and dark mode
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => actions.setTheme('light')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${state.theme === 'light'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                aria-pressed={state.theme === 'light'}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => actions.setTheme('dark')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${state.theme === 'dark'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                aria-pressed={state.theme === 'dark'}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Data management */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Export Progress
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download your typing history as a JSON file
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              disabled={state.history.length === 0}
            >
              Export
            </button>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Import */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Import Progress
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Restore from a previously exported file
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Import file"
              />
              <button
                onClick={handleImportClick}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Import
              </button>
            </div>
          </div>

          {/* Import status message */}
          {importStatus && (
            <div
              className={`p-3 rounded-lg text-sm ${importStatus.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
              role="alert"
            >
              {importStatus.message}
            </div>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Clear All Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete all your typing history and statistics
              </p>
            </div>
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Clear Data
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics summary */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Statistics
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total sessions</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {state.history.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Keys tracked</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Object.keys(state.mistypedKeys).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total errors</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Object.values(state.mistypedKeys).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Data size</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(new Blob([JSON.stringify(state.history)]).size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
