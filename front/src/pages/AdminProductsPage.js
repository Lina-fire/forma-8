import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API = 'http://localhost:8080/api';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Проверка прав администратора
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/catalog');
    }
  }, [user, navigate]);

  // Загрузка всех товаров
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products/all`);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: { 'x-access-token': token }
      });
      await fetchProducts();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении товара');
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (product) => {
    if (!product.image_url) {
      return 'https://via.placeholder.com/80x80?text=Нет+фото';
    }
    if (product.image_url.startsWith('http')) {
      return product.image_url;
    }
    if (product.image_url.startsWith('/uploads')) {
      return `http://localhost:8080${product.image_url}`;
    }
    return product.image_url;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ color: '#c41e3a', fontSize: '1.2rem' }}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{
          color: '#1a1a1a',
          borderLeft: '4px solid #c41e3a',
          paddingLeft: '15px',
          margin: 0
        }}>
          Управление товарами
        </h1>
        <button
          onClick={() => navigate('/admin/products/add')}
          style={{
            padding: '12px 24px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.background = '#218838'}
          onMouseLeave={(e) => e.target.style.background = '#28a745'}
        >
          ➕ Добавить товар
        </button>
      </div>

      {products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: '#f8f9fa',
          borderRadius: '16px'
        }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>Нет добавленных товаров</p>
          <button
            onClick={() => navigate('/admin/products/add')}
            style={{
              padding: '10px 20px',
              background: '#c41e3a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Добавить первый товар
          </button>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Изображение</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Название</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Цена</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Размер</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Цвет</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>На складе</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: index !== products.length - 1 ? '1px solid #e0e0e0' : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (e.currentTarget) e.currentTarget.style.background = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget) e.currentTarget.style.background = 'white';
                  }}
                >
                  <td style={{ padding: '15px' }}>{product.id}</td>
                  <td style={{ padding: '15px' }}>
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=Нет+фото';
                      }}
                    />
                  </td>
                  <td style={{ padding: '15px', maxWidth: '200px' }}>
                    <strong>{product.name}</strong>
                    <br />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {product.description?.substring(0, 50)}...
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#c41e3a' }}>
                    {Number(product.price).toFixed(2)} ₽
                  </td>
                  <td style={{ padding: '15px' }}>{product.size || '-'}</td>
                  <td style={{ padding: '15px' }}>{product.color || '-'}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: product.stock_quantity > 0 ? '#d4edda' : '#f8d7da',
                      color: product.stock_quantity > 0 ? '#155724' : '#721c24',
                      fontSize: '12px'
                    }}>
                      {product.stock_quantity} шт.
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        style={{
                          padding: '6px 12px',
                          background: '#ffc107',
                          color: '#1a1a1a',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#e0a800'}
                        onMouseLeave={(e) => e.target.style.background = '#ffc107'}
                      >
                        ✏️ Редактировать
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#bb2d3b'}
                        onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            <h3 style={{ marginBottom: '15px', color: '#dc3545' }}>Подтверждение удаления</h3>
            <p style={{ marginBottom: '25px', color: '#666' }}>
              Вы уверены, что хотите удалить этот товар?<br />
              Это действие нельзя отменить.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deletingId === showDeleteConfirm}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: deletingId === showDeleteConfirm ? 'not-allowed' : 'pointer'
                }}
              >
                {deletingId === showDeleteConfirm ? 'Удаление...' : 'Да, удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}