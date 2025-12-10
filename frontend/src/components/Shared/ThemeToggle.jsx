// components/ThemeToggle.jsx
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors group"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-yellow-400 transition-all duration-300 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
      
      {/* Tooltip */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  );
};

// Alternative compact version
export const CompactThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
    >
      {isDark ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm">Light</span>
        </>
      )}
    </button>
  );
};

// Slider version
export const SliderThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-gray-900" />
        ) : (
          <Sun className="w-3 h-3 text-gray-900" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;