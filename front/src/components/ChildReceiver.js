import React from 'react';

function ChildReceiver({ name, size, material, color, price }) {
  return (
    <div style={{ background: '#d1ecf1', padding: '15px', borderRadius: '10px' }}>
      <h5>🧾 Дочерний компонент получил данные:</h5>
      <p><strong>Название:</strong> {name}</p>
      <p><strong>Размер:</strong> {size}</p>
      <p><strong>Материал:</strong> {material}</p>
      <p><strong>Цвет:</strong> {color}</p>
      <p><strong>Цена:</strong> {price} ₽</p>
    </div>
  );
}

export default ChildReceiver;