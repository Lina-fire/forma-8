import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8080/api';  

export default function AtelierRequestPage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [form, setForm] = useState({
    service_type: 'ремонт',
    description: '',
    contact_phone: ''
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
        <h2 style={{ color: '#1a4b6d' }}>Войдите, чтобы оставить заявку</h2>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.description) {
      alert('Заполните описание услуги');
      return;
    }
    if (!form.contact_phone) {
      alert('Укажите контактный телефон');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('service_type', form.service_type);
    formData.append('description', form.description);
    formData.append('contact_phone', form.contact_phone);
    if (photo) formData.append('photo', photo);

    try {
      await axios.post(`${API}/atelier/create`, formData, {
        headers: { 
          'x-access-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Заявка успешно отправлена! Администратор свяжется с вами.');
      navigate('/catalog');
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка отправки заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#1a4b6d',
          fontSize: '1.8rem',
          marginBottom: '10px',
          borderBottom: '2px solid #d94a2c',
          paddingBottom: '10px'
        }}>
          Заявка в ателье
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Оставьте заявку на ремонт, пошив или подгонку спецодежды
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#333', marginBottom: '8px', fontWeight: '500' }}>
              Тип услуги *
            </label>
            <select
              value={form.service_type}
              onChange={e => setForm({ ...form, service_type: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <option value="ремонт">Ремонт одежды</option>
              <option value="пошив">Индивидуальный пошив</option>
              <option value="подгонка">Подгонка по фигуре</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#333', marginBottom: '8px', fontWeight: '500' }}>
              Описание услуги *
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Опишите подробно, что нужно сделать..."
              rows="5"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#333', marginBottom: '8px', fontWeight: '500' }}>
              Фото (для оценки)
            </label>
            <input
              type="file"
              onChange={e => setPhoto(e.target.files[0])}
              accept="image/*"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Загрузите фото для более точной оценки (максимум 5 МБ)
            </small>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#333', marginBottom: '8px', fontWeight: '500' }}>
              Контактный телефон *
            </label>
            <input
              type="tel"
              value={form.contact_phone}
              onChange={e => setForm({ ...form, contact_phone: e.target.value })}
              placeholder="+7 (900) 123-45-67"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#d94a2c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
}