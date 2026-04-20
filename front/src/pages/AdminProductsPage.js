import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';

export default function AdminProductsPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    color: '',
    material: '',
    stock_quantity: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
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
        stock_quantity: ''
      });
      setImage(null);
    } catch (error) {
      alert('Ошибка добавления товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a1a', borderBottom: '2px solid #c41e3a', paddingBottom: '10px', marginBottom: '30px' }}>
        Добавление товара
      </h1>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Название товара *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Описание"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows="3"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Цена *"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Размер"
            value={form.size}
            onChange={e => setForm({ ...form, size: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Цвет"
            value={form.color}
            onChange={e => setForm({ ...form, color: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Материал"
            value={form.material}
            onChange={e => setForm({ ...form, material: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <input
            type="number"
            placeholder="Количество на складе"
            value={form.stock_quantity}
            onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
            accept="image/*"
            style={{ padding: '10px' }}
          />
          <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
            Поддерживаемые форматы: JPEG, PNG, GIF. Максимум 5MB
          </small>
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
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Добавление...' : 'Добавить товар'}
        </button>
      </form>
    </div>
  );
}