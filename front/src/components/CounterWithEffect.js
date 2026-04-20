import React, { useState, useEffect } from 'react';

function CounterWithEffect({ initialCount = 2 }) {
  const [count, setCount] = useState(initialCount);
  const [lastAction, setLastAction] = useState('');

  // Эффект для логирования и смены заголовка (как в лабораторной №19)
  useEffect(() => {
    console.log(`useEffect сработал! Значение count изменилось на: ${count}`);
    document.title = `Ателье №8 | Счётчик: ${count}`;

    // Функция очистки
    return () => {
      console.log('Очистка предыдущего эффекта...');
    };
  }, [count]);

  // Дополнительный эффект для отслеживания действий
  useEffect(() => {
    if (lastAction) {
      console.log(`Последнее действие: ${lastAction}`);
    }
  }, [lastAction]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setLastAction('Увеличение счётчика');
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
    setLastAction('Уменьшение счётчика');
  };

  const handleReset = () => {
    setCount(initialCount);
    setLastAction('Сброс счётчика');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '25px',
      borderRadius: '15px',
      color: 'white',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>
        Демонстрация useState и useEffect
      </h3>
      
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '20px 0',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        {count}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleDecrement}
          style={{
            ...buttonStyle,
            background: '#ff4757'
          }}
        >
          −
        </button>
        <button
          onClick={handleReset}
          style={{
            ...buttonStyle,
            background: '#ffa502',
            minWidth: '100px'
          }}
        >
          Сброс
        </button>
        <button
          onClick={handleIncrement}
          style={{
            ...buttonStyle,
            background: '#26de81'
          }}
        >
          +
        </button>
      </div>
      
      {lastAction && (
        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          padding: '10px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          {lastAction}
        </div>
      )}
      
      <div style={{
        marginTop: '15px',
        fontSize: '0.85rem',
        textAlign: 'center',
        opacity: 0.9
      }}>
      </div>
    </div>
  );
}

const buttonStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '25px',
  border: 'none',
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
};

export default CounterWithEffect;