import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.favorites);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchFavorites());
  }, [user, dispatch]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
        <h2 style={{ color: '#1a4b6d' }}>Войдите, чтобы увидеть избранное</h2>
        <Link to="/login" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 24px',
          background: '#d94a2c',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px'
        }}>Войти</Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}><h3 style={{ color: '#d94a2c' }}>Загрузка...</h3></div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
        <h2 style={{ color: '#1a4b6d' }}>В избранном пока ничего нет</h2>
        <Link to="/catalog" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 24px',
          background: '#d94a2c',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px'
        }}>Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 style={{ color: '#1a4b6d', borderBottom: '2px solid #d94a2c', paddingBottom: '10px', marginBottom: '30px' }}>
        Избранное
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '15px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <img 
              src={item.image_url || 'https://via.placeholder.com/300x200?text=Нет+фото'} 
              alt={item.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
            />
            <h3 style={{ color: '#333', marginBottom: '10px' }}>{item.name}</h3>
            <p style={{ color: '#d94a2c', fontSize: '1.2rem', fontWeight: 'bold' }}>{item.price} ₽</p>
            <button
              onClick={() => dispatch(removeFromFavorites(item.product_id))}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '10px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Удалить из избранного
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}