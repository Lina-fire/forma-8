import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ username: 'admin@forma8.ru', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (!result.error) {
      navigate('/catalog');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',  // ← уменьшаем высоту
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',  // ← уменьшаем padding
        width: '100%',
        maxWidth: '400px',  // ← уменьшаем ширину
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderTop: '4px solid #d94a2c'
      }}>
        <h2 style={{
          color: '#1a4b6d',
          fontSize: '1.5rem',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Вход в личный кабинет
        </h2>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '13px' }}>
              Email или имя пользователя
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '13px' }}>
              Пароль
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              background: '#d94a2c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }}>
          Нет аккаунта? <Link to="/register" style={{ color: '#d94a2c' }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}