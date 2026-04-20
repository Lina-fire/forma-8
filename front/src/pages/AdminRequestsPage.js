import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API}/atelier/all`, {
        headers: { 'x-access-token': token }
      });
      setRequests(res.data.requests || []);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  };

  const updateStatus = async (requestId, status, adminNotes) => {
    try {
      await axios.put(`${API}/atelier/${requestId}/status`, { status, admin_notes: adminNotes }, {
        headers: { 'x-access-token': token }
      });
      fetchRequests();
      alert('Статус обновлён');
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a1a', borderBottom: '2px solid #c41e3a', paddingBottom: '10px', marginBottom: '30px' }}>
        Заявки в ателье
      </h1>
      {requests.map(req => (
        <div key={req.id} style={{
          border: '1px solid #ddd',
          margin: '15px 0',
          padding: '20px',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h3 style={{ color: '#1a1a1a' }}>Заявка №{req.id}</h3>
            <p><strong>Клиент:</strong> {req.username}</p>
            <p><strong>Email:</strong> {req.email}</p>
            <p><strong>Телефон:</strong> {req.contact_phone}</p>
            <p><strong>Тип услуги:</strong> {req.service_type}</p>
            <p><strong>Описание:</strong> {req.description}</p>
            {req.photo_url && (
              <p><strong>Фото:</strong> <a href={`http://localhost:8080${req.photo_url}`} target="_blank" rel="noreferrer">Посмотреть</a></p>
            )}
            <p><strong>Статус:</strong> <span style={{ color: '#c41e3a', fontWeight: 'bold' }}>{req.status}</span></p>
            <div style={{ marginTop: '15px' }}>
              <select 
                value={req.status} 
                onChange={(e) => updateStatus(req.id, e.target.value, prompt('Комментарий для клиента (необязательно):') || '')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #c41e3a',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="новая">Новая</option>
                <option value="в работе">В работе</option>
                <option value="выполнена">Выполнена</option>
                <option value="отменена">Отменена</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      {requests.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>Нет заявок</p>
      )}
    </div>
  );
}