import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/all`, {
        headers: { 'x-access-token': token }
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { status }, {
        headers: { 'x-access-token': token }
      });
      fetchOrders();
      alert('Статус обновлён');
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a1a', borderBottom: '2px solid #c41e3a', paddingBottom: '10px', marginBottom: '30px' }}>
        Управление заказами
      </h1>
      {orders.map(order => (
        <div key={order.id} style={{
          border: '1px solid #ddd',
          margin: '15px 0',
          padding: '20px',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h3 style={{ color: '#1a1a1a' }}>Заказ №{order.id}</h3>
              <p><strong>Клиент:</strong> {order.username}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Телефон:</strong> {order.phone}</p>
              <p><strong>Адрес:</strong> {order.delivery_address}</p>
              <p><strong>Сумма:</strong> <span style={{ color: '#c41e3a', fontWeight: 'bold' }}>{order.total_amount} ₽</span></p>
              <p><strong>Статус:</strong> <span style={{ color: '#c41e3a', fontWeight: 'bold' }}>{order.status}</span></p>
            </div>
            <div>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order.id, e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #c41e3a',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="новый">Новый</option>
                <option value="в обработке">В обработке</option>
                <option value="отправлен">Отправлен</option>
                <option value="доставлен">Доставлен</option>
                <option value="отменен">Отменен</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>Нет заказов</p>
      )}
    </div>
  );
} 