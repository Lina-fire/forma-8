import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const API = 'http://localhost:8080/api';

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
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

  // Загрузка данных товара
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${API}/products/${id}`);
        const product = res.data;
        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          size: product.size || '',
          color: product.color || '',
          material: product.material || '',
          stock_quantity: product.stock_quantity || '',
          category_id: product.category_id || ''
        });
        setCurrentImage(product.image_url);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        setError('Товар не найден');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Валидация цены
    if (form.price && parseFloat(form.price) <= 100) {
      setError('Цена товара должна быть больше 100 ₽');
      setSaving(false);
      return;
    }

    const data = new FormData();
    data.append('name', form.name || '');
    data.append('description', form.description || '');
    data.append('price', form.price || '0');
    data.append('size', form.size || '');
    data.append('color', form.color || '');
    data.append('material', form.material || '');
    data.append('stock_quantity', form.stock_quantity === '' ? '0' : form.stock_quantity);
    data.append('category_id', form.category_id === '' ? '' : form.category_id);
    if (image) data.append('image', image);

    try {
      await axios.put(`${API}/products/${id}`, data, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Товар успешно обновлен!');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при обновлении товара');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: { 'x-access-token': token }
      });
      setSuccess('Товар успешно удален!');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при удалении товара');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ color: '#c41e3a', fontSize: '1.2rem' }}>Загрузка...</div>
      </div>
    );
  }

  if (error && error !== 'Товар не найден') {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ color: '#dc3545', fontSize: '1.2rem' }}>{error}</div>
        <button
          onClick={() => navigate('/admin/products')}
          style={{
            marginTop: '20px',
            padding: '10px 24px',
            background: '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/admin/products')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                color: '#666'
              }}
            >
              <ArrowBackIcon />
            </button>
            <h1 style={{
              color: '#1a1a1a',
              fontSize: '1.8rem',
              borderLeft: '4px solid #c41e3a',
              paddingLeft: '15px',
              margin: 0
            }}>
              Редактирование товара
            </h1>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              padding: '10px 20px',
              background: '#fff',
              color: '#c41e3a',
              border: '1px solid #c41e3a',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#c41e3a';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#c41e3a';
            }}
          >
            <DeleteIcon /> Удалить товар
          </button>
        </div>

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

        {error === 'Товар не найден' ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#dc3545', marginBottom: '20px' }}>Товар не найден</p>
            <button
              onClick={() => navigate('/admin/products')}
              style={{
                padding: '10px 24px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Вернуться к списку
            </button>
          </div>
        ) : (
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
                  Цена * (₽) (больше 100)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="101"
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
                Текущее изображение
              </label>
              {currentImage && (
                <div style={{ marginBottom: '10px' }}>
                  <img
                    src={currentImage.startsWith('http') ? currentImage : `http://localhost:8080${currentImage}`}
                    alt={form.name}
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              )}
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
                Новое изображение (оставьте пустым, чтобы не менять)
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
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
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
              <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                Поддерживаемые форматы: JPEG, PNG, GIF. Максимум 5MB
              </small>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e0e0e0';
                  e.target.style.borderColor = '#c41e3a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f5f5f5';
                  e.target.style.borderColor = '#ddd';
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.target.style.background = '#c41e3a';
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.target.style.background = '#1a1a1a';
                }}
              >
                {saving ? 'Сохранение...' : <><SaveIcon /> Сохранить изменения</>}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#c41e3a' }}>Подтверждение удаления</h3>
            <p style={{ marginBottom: '25px', color: '#666' }}>
              Вы уверены, что хотите удалить товар <strong>"{form.name}"</strong>?<br />
              Это действие нельзя отменить.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#c41e3a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: deleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleting ? 'Удаление...' : 'Да, удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}