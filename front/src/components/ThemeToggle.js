import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '30px',
        border: 'none',
        cursor: 'pointer',
        background: theme === 'light' ? '#1a4b6d' : '#f5f5f5',
        color: theme === 'light' ? 'white' : '#1a4b6d',
        fontWeight: 'bold',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
    >
      {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
    </button>
  );
}