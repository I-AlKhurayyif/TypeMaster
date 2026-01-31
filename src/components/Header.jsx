import React from 'react';
import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';

/**
 * Header component with navigation and theme toggle
 */
function Header({ onNavigate, currentView }) {
  const { state, actions } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: '⌨️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Go to home"
          >
            <span className="text-2xl">⌨️</span>
            <span className="hidden sm:inline">TypeMaster</span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === item.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="sm:hidden">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}

            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-600">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
