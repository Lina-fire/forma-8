import React from 'react';

function ArrayDisplay({ products }) {
  return (
    <div>
      <h4>Каталог товаров:</h4>
      <ul>
        {products.map(product => (
          <li key={product.id} style={{ margin: '10px 0', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
            <strong>{product.name}</strong> - {product.price} ₽
            <br />
            <small>Размер: {product.size}, цвет: {product.color}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArrayDisplay;