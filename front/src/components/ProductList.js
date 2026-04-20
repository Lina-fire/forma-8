import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ProductList({ 
  products, 
  loading, 
  isInCart, 
  isInFavorites,
  onAddToCart,
  onRemoveFromCart,
  onAddToFavorites,
  onRemoveFromFavorites
}) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: theme === 'light' ? '#1a4b6d' : '#a8d8ff' }}>
          Загрузка...
        </h2>
      </div>
    );
  }

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    padding: '8px',
    transition: 'transform 0.2s',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {products.map((product) => (
        <div key={product.id} style={{
          background: theme === 'light' ? '#fff' : '#2d2d2d',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: theme === 'light'
            ? '0 4px 15px rgba(0,0,0,0.1)'
            : '0 4px 15px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s',
          position: 'relative',
          border: theme === 'light' ? '1px solid #e0e0e0' : '1px solid #444'
        }}>
          {/* Кнопки действий */}
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            display: 'flex', 
            gap: '5px',
            zIndex: 1,
            background: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
            borderRadius: '30px',
            padding: '5px'
          }}>
            {/* Кнопка избранного (сердечко) */}
            <button
              onClick={() => {
                if (isInFavorites(product.id)) {
                  onRemoveFromFavorites(product.id);
                } else {
                  onAddToFavorites(product);
                }
              }}
              style={iconButtonStyle}
              title={isInFavorites(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              {isInFavorites(product.id) ? '❤️' : '🤍'}
            </button>
            
            {/* Кнопка корзины */}
            <button
              onClick={() => {
                if (isInCart(product.id)) {
                  onRemoveFromCart(product.id);
                } else {
                  onAddToCart(product);
                }
              }}
              style={iconButtonStyle}
              title={isInCart(product.id) ? 'Удалить из корзины' : 'Добавить в корзину'}
            >
              {isInCart(product.id) ? '🛒✅' : '🛒'}
            </button>
          </div>

          <img
            src={product.image && product.image !== '' && !product.image.startsWith('http')
              ? `http://localhost:8080${product.image}`
              : (product.image || 'https://via.placeholder.com/300x200?text=Товар')}
            alt={product.name}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '10px'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Товар';
            }}
          />
          <h4 style={{ color: theme === 'light' ? '#1a4b6d' : '#a8d8ff', margin: '10px 0' }}>
            {product.name}
          </h4>
          <p style={{ color: theme === 'light' ? '#666' : '#bbb', fontSize: '0.9rem' }}>
            {product.description || 'Описание отсутствует'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: theme === 'light' ? '#d94a2c' : '#ff8a5c'
            }}>
              {product.price} ₽
            </span>
            <span style={{
              background: theme === 'light' ? '#f0f0f0' : '#3d3d3d',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              color: theme === 'light' ? '#666' : '#bbb'
            }}>
              {product.size} | {product.color}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;