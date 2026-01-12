/**
 * Custom Hook: useTheme
 * Hook for managing light/dark theme
 */

import { useState, useEffect, useCallback } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply theme to document
  const applyTheme = useCallback((isDark) => {
    const html = document.documentElement;
    
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#f9fafb';
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    } else {
      html.removeAttribute('data-theme');
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
  }, []);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, [applyTheme]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      const themeValue = newDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', themeValue);
      applyTheme(newDarkMode);
      return newDarkMode;
    });
  }, [applyTheme]);

  // Set specific theme
  const setTheme = useCallback((themeName) => {
    const isDark = themeName === 'dark';
    setIsDarkMode(isDark);
    localStorage.setItem('theme', themeName);
    applyTheme(isDark);
  }, [applyTheme]);

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
  };
};
