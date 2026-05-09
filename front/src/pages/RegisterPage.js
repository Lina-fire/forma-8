import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (!result.error) {
      navigate('/catalog');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f5f0eb 0%, #e8e0d8 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        borderTop: '4px solid #c41e3a'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="/logo.png" 
            alt="Форма №8" 
            style={{ height: '60px', marginBottom: '15px' }}
          />
          <h2 style={{ color: '#1a1a1a', fontSize: '1.8rem', marginBottom: '8px' }}>
            Регистрация
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Создайте новый аккаунт
          </p>
        </div>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>
              Имя пользователя *
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c41e3a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c41e3a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>
              Телефон
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c41e3a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>
              Пароль *
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c41e3a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#c41e3a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#a01830'}
            onMouseLeave={(e) => e.target.style.background = '#c41e3a'}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Уже есть аккаунт?{' '}
            <Link to="/login" style={{ color: '#c41e3a', textDecoration: 'none', fontWeight: '500' }}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}