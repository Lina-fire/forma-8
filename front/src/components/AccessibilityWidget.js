import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityWidget() {
  const { 
    highContrast, 
    largeText, 
    reduceMotion,
    toggleHighContrast, 
    toggleLargeText, 
    toggleReduceMotion 
  } = useAccessibility();
  
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const handleToggleHighContrast = () => {
    toggleHighContrast();
    setAnnouncement(highContrast ? 'Высокая контрастность выключена' : 'Высокая контрастность включена');
  };

  const handleToggleLargeText = () => {
    toggleLargeText();
    setAnnouncement(largeText ? 'Крупный шрифт выключен' : 'Крупный шрифт включен');
  };

  const handleToggleReduceMotion = () => {
    toggleReduceMotion();
    setAnnouncement(reduceMotion ? 'Анимации включены' : 'Анимации отключены');
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {announcement}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Настройки доступности"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            width: '280px',
            background: highContrast ? '#000000' : '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 999,
            border: highContrast ? '3px solid #ffffff' : '1px solid #e0e0e0',
            color: highContrast ? '#ffffff' : '#333333'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Настройки доступности</h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: highContrast ? '#ffffff' : '#999999',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleToggleHighContrast}
              aria-pressed={highContrast}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: highContrast ? '#333333' : '#f5f5f5',
                border: highContrast ? '2px solid #ffffff' : '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                color: highContrast ? '#ffffff' : '#333333',
                fontWeight: highContrast ? 'bold' : 'normal'
              }}
            >
              <span style={{ fontSize: '24px' }}>🌓</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Высокая контрастность</span>
              {highContrast && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓</span>}
            </button>

            <button
              onClick={handleToggleLargeText}
              aria-pressed={largeText}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: largeText ? '#333333' : '#f5f5f5',
                border: highContrast ? '2px solid #ffffff' : '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                color: highContrast ? '#ffffff' : '#333333',
                fontWeight: largeText ? 'bold' : 'normal'
              }}
            >
              <span style={{ fontSize: '24px' }}>🔤</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Крупный шрифт</span>
              {largeText && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓</span>}
            </button>

            <button
              onClick={handleToggleReduceMotion}
              aria-pressed={reduceMotion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: reduceMotion ? '#333333' : '#f5f5f5',
                border: highContrast ? '2px solid #ffffff' : '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                color: highContrast ? '#ffffff' : '#333333',
                fontWeight: reduceMotion ? 'bold' : 'normal'
              }}
            >
              <span style={{ fontSize: '24px' }}>🎬</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Отключить анимации</span>
              {reduceMotion && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓</span>}
            </button>
          </div>

          <div style={{ 
            marginTop: '16px', 
            paddingTop: '12px', 
            borderTop: highContrast ? '1px solid #ffffff' : '1px solid #e0e0e0',
            fontSize: '12px',
            color: highContrast ? '#cccccc' : '#666666'
          }}>
            <p style={{ margin: 0 }}>
              ⌨️ Клавиатура: Tab, Shift+Tab, Enter<br/>
              ⎋ Escape — закрыть это окно
            </p>
          </div>
        </div>
      )}
    </>
  );
}