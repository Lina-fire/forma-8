import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  // Состояния для доступности
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  // Сохраняем настройки в localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('a11y_highContrast');
    const savedLargeText = localStorage.getItem('a11y_largeText');
    const savedReduceMotion = localStorage.getItem('a11y_reduceMotion');
    
    if (savedHighContrast === 'true') setHighContrast(true);
    if (savedLargeText === 'true') setLargeText(true);
    if (savedReduceMotion === 'true') setReduceMotion(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('a11y_highContrast', highContrast);
    localStorage.setItem('a11y_largeText', largeText);
    localStorage.setItem('a11y_reduceMotion', reduceMotion);
    
    // Применяем классы к body
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
    
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [highContrast, largeText, reduceMotion]);

  // Отслеживание фокуса с клавиатуры (для видимого индикатора) - пункты 10, 11
  useEffect(() => {
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };
    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);

  // Функции для управления настройками
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleReduceMotion = () => setReduceMotion(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      largeText,
      reduceMotion,
      focusVisible,
      toggleHighContrast,
      toggleLargeText,
      toggleReduceMotion,
      setFocusVisible
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility должен использоваться внутри AccessibilityProvider');
  }
  return context;
}