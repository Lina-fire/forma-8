// components/ExtraComponent.js — дополнительный шестой компонент (тоже с пропсами)
import React from 'react';

function ExtraComponent({ title, discount, endTime }) {
  return (
    <div style={{ background: '#cce5ff', padding: '15px', borderRadius: '12px' }}>
      <h4>🔥 {title}</h4>
      <p>Скидка: <strong>{discount}</strong></p>
      <p>Действует до: {endTime}</p>
      <button style={{ background: '#1a4b6d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px' }}>
        Воспользоваться
      </button>
    </div>
  );
}

export default ExtraComponent;