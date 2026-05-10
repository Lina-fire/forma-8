import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useAccessibility } from '../context/AccessibilityContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function Navbar() {
  const { user } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: favItems } = useSelector(state => state.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { highContrast, toggleHighContrast, toggleLargeText, toggleReduceMotion, isOpen, setIsOpen } = useAccessibility();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav style={{
      background: 'white',
      padding: '12px 30px',
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
        {/* Логотип */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/images/logo.png" alt="Форма №8" style={{ height: '45px', width: 'auto' }} />
        </Link>

        {/* Основные ссылки */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
            Главная
          </Link>
          <Link to="/catalog" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
            Каталог
          </Link>
          {user && (
            <>
              <Link to="/cart" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShoppingCartIcon style={{ fontSize: '20px' }} />
                <span style={{ background: '#c41e3a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{cartItems.length}</span>
              </Link>
              <Link to="/favorites" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FavoriteIcon style={{ fontSize: '20px' }} />
                <span style={{ background: '#c41e3a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{favItems.length}</span>
              </Link>
              <Link to="/atelier" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>
                Заявка
              </Link>
            </>
          )}
        </div>

        {/* Админ панель */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/admin/orders" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ReceiptIcon style={{ fontSize: '18px' }} /> Заказы
            </Link>
            <Link to="/admin/requests" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <InventoryIcon style={{ fontSize: '18px' }} /> Заявки
            </Link>
            <Link to="/admin/products" style={{ color: '#1a1a1a', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AddBoxIcon style={{ fontSize: '18px' }} /> + Товар
            </Link>
          </div>
        )}

        {/* Правая часть: доступность и профиль */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Кнопка специальных возможностей */}
          <button
            onClick={toggleHighContrast}
            style={{
              background: highContrast ? '#c41e3a' : 'none',
              border: highContrast ? '2px solid white' : '1px solid #ddd',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: highContrast ? 'white' : '#c41e3a'
            }}
            title="Высокая контрастность"
          >
            <AccessibilityIcon />
          </button>

          {user ? (
            <>
              <Link to="/profile" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <PersonIcon style={{ fontSize: '20px' }} />
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: '#c41e3a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#a01830'}
                onMouseLeave={(e) => e.target.style.background = '#c41e3a'}
              >
                <LogoutIcon style={{ fontSize: '16px' }} /> Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LoginIcon style={{ fontSize: '18px' }} /> Вход
              </Link>
              <Link to="/register" style={{ color: '#c41e3a', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AppRegistrationIcon style={{ fontSize: '18px' }} /> Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}