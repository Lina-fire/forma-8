import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: favItems } = useSelector(state => state.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav style={{
      background: 'white',
      padding: '15px 30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <Link to="/catalog" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}>
          <img
            src="/logo.png"
            alt="Форма №8"
            style={{
              height: '45px',
              width: 'auto'
            }}
          />
        </Link>

        {/* Основные ссылки - чёрные */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/catalog" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
            Каталог
          </Link>
          {user && (
            <>
              <Link to="/cart" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
                Корзина ({cartItems.length})
              </Link>
              <Link to="/favorites" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
                Избранное ({favItems.length})
              </Link>
              <Link to="/atelier" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
                Ателье
              </Link>
            </>
          )}
        </div>

        {/* Админ панель */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ color: '#c41e3a', fontSize: '12px', alignSelf: 'center' }}>🔧 Админ</span>
            <Link to="/admin/orders" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}>
              Заказы
            </Link>
            <Link to="/admin/requests" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}>
              Заявки
            </Link>
            <Link to="/admin/products" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}>
              + Товар
            </Link>
          </div>
        )}

        {/* Пользователь и кнопка выхода */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#c41e3a', fontWeight: '500' }}>👤 {user.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: '#c41e3a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.background = '#a01830'}
                onMouseLeave={(e) => e.target.style.background = '#c41e3a'}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: '500' }}>Вход</Link>
              <Link to="/register" style={{ color: '#c41e3a', textDecoration: 'none', fontWeight: '500' }}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}