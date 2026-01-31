import { useEffect, useCallback } from 'react';

/**
 * Custom hook for handling keyboard input
 * Captures typing events and routes them to the appropriate handler
 */
export function useKeyboardInput({ onKeyPress, onBackspace, enabled = true }) {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Prevent default for certain keys to avoid browser actions
    if (event.key === 'Tab' || event.key === 'F5') {
      // Allow these through for accessibility
      return;
    }

    // Handle backspace
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (onBackspace) {
        onBackspace();
      }
      return;
    }

    // Ignore modifier keys alone
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'].includes(event.key)) {
      return;
    }

    // Ignore keyboard shortcuts
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    // Handle printable characters
    if (event.key.length === 1) {
      event.preventDefault();
      if (onKeyPress) {
        onKeyPress(event.key);
      }
    }

    // Handle Enter as newline
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onKeyPress) {
        onKeyPress('\n');
      }
    }
  }, [enabled, onKeyPress, onBackspace]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  return { handleKeyDown };
}

export default useKeyboardInput;
