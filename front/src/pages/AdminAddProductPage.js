import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API = 'http://localhost:8080/api';

export default function AdminAddProductPage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    color: '',
    material: '',
    stock_quantity: '',
    category_id: ''
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Проверка прав администратора
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/catalog');
    }
  }, [user, navigate]);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories/all`);
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const data = new FormData();
  data.append('name', form.name || '');
  data.append('description', form.description || '');
  data.append('price', form.price || '0');
  data.append('size', form.size || '');
  data.append('color', form.color || '');
  data.append('material', form.material || '');
  // Важно: отправляем 0 вместо пустой строки
  data.append('stock_quantity', form.stock_quantity === '' ? '0' : form.stock_quantity);
  data.append('category_id', form.category_id === '' ? '' : form.category_id);
  if (image) data.append('image', image);
  
  try {
    await axios.post(`${API}/products/add`, data, {
      headers: { 
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    });
    alert('Товар успешно добавлен!');
    setForm({
      name: '',
      description: '',
      price: '',
      size: '',
      color: '',
      material: '',
      stock_quantity: '',
      category_id: ''
    });
    setImage(null);
  } catch (error) {
    alert('Ошибка добавления товара');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#1a1a1a',
          fontSize: '1.8rem',
          borderLeft: '4px solid #c41e3a',
          paddingLeft: '15px',
          marginBottom: '25px'
        }}>
          Добавление нового товара
        </h1>

        {success && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Название товара *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Категория
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Описание
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
                Цена * (₽)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
                Количество на складе
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                min="0"
                step="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
                Размер
              </label>
              <input
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
                Цвет
              </label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
                Материал
              </label>
              <input
                type="text"
                name="material"
                value={form.material}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Изображение товара
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Поддерживаемые форматы: JPEG, PNG, GIF. Максимум 5MB
            </small>
            {image && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Предпросмотр"
                  style={{
                    maxWidth: '150px',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              style={{
                flex: 1,
                padding: '12px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5a6268'}
              onMouseLeave={(e) => e.target.style.background = '#6c757d'}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: '#c41e3a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#a01830';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#c41e3a';
              }}
            >
              {loading ? 'Добавление...' : 'Добавить товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}