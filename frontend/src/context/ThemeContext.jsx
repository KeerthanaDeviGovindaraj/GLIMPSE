import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { 
    theme,          // Current theme ('dark' or 'light')
    isDark,         // Boolean: is dark theme
    isLight,        // Boolean: is light theme
    toggleTheme,    // Toggle function
    colors          // Current theme colors
  } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{ background: colors.accent }}
    >
      {isDark ? '🌙' : '☀️'} Toggle Theme
    </button>
  );
}