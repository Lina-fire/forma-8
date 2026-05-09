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

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть настройки доступности"
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: highContrast ? '#000' : '#c41e3a',
          color: 'white',
          border: highContrast ? '2px solid #fff' : 'none',
          cursor: 'pointer',
          fontSize: '24px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: reduceMotion ? 'none' : 'all 0.3s',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        ♿
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Настройки доступности"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '20px',
            width: '280px',
            background: highContrast ? '#000' : '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 999,
            border: highContrast ? '2px solid #fff' : '1px solid #eee',
            color: highContrast ? '#fff' : '#333'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Настройки доступности</h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: highContrast ? '#fff' : '#999'
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
                padding: '10px',
                background: highContrast ? '#333' : '#f0f0f0',
                border: highContrast ? '1px solid #fff' : 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: highContrast ? '#fff' : '#333'
              }}
            >
              <span style={{ fontSize: '20px' }}>🌓</span>
              <span>Высокая контрастность {highContrast ? '✓' : ''}</span>
            </button>

            <button
              onClick={handleToggleLargeText}
              aria-pressed={largeText}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                background: largeText ? '#333' : '#f0f0f0',
                border: highContrast ? '1px solid #fff' : 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: highContrast ? '#fff' : '#333'
              }}
            >
              <span style={{ fontSize: '20px' }}>🔤</span>
              <span>Крупный шрифт {largeText ? '✓' : ''}</span>
            </button>

            <button
              onClick={handleToggleReduceMotion}
              aria-pressed={reduceMotion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                background: reduceMotion ? '#333' : '#f0f0f0',
                border: highContrast ? '1px solid #fff' : 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: highContrast ? '#fff' : '#333'
              }}
            >
              <span style={{ fontSize: '20px' }}>🎬</span>
              <span>Отключить анимации {reduceMotion ? '✓' : ''}</span>
            </button>
          </div>

          <div style={{ 
            marginTop: '16px', 
            paddingTop: '12px', 
            borderTop: highContrast ? '1px solid #fff' : '1px solid #eee',
            fontSize: '12px',
            color: highContrast ? '#ccc' : '#666'
          }}>
            <p style={{ margin: 0 }}>
              ♿ Клавиатура: Tab, Shift+Tab, Enter<br/>
              Escape — закрыть это окно
            </p>
          </div>
        </div>
      )}
    </>
  );
}