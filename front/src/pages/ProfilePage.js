import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../store/slices/ordersSlice';
import { fetchUserRequests } from '../store/slices/atelierSlice';
import { fetchFavorites } from '../store/slices/favoritesSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: orders, loading: ordersLoading } = useSelector(state => state.orders || { list: [] });
  const { requests = [], loading: requestsLoading } = useSelector(state => state.atelier || { requests: [] });
  const { items: favorites } = useSelector(state => state.favorites);
  
  const [activeTab, setActiveTab] = React.useState('orders');

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders());
      dispatch(fetchUserRequests());
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  // Обновляем данные каждые 10 секунд (чтобы видеть изменения статусов)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      dispatch(fetchUserOrders());
      dispatch(fetchUserRequests());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
        <h2 style={{ color: '#1a4b6d' }}>Войдите, чтобы просмотреть личный кабинет</h2>
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

  const getStatusColor = (status) => {
    const colors = {
      'новый': '#ffc107',
      'в обработке': '#17a2b8',
      'отправлен': '#007bff',
      'доставлен': '#28a745',
      'отменен': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const texts = {
      'новый': '🆕 Новый',
      'в обработке': '⚙️ В обработке',
      'отправлен': '📦 Отправлен',
      'доставлен': '✅ Доставлен',
      'отменен': '❌ Отменен'
    };
    return texts[status] || status;
  };

  const getRequestStatusColor = (status) => {
    const colors = {
      'новая': '#ffc107',
      'в работе': '#17a2b8',
      'выполнена': '#28a745',
      'отменена': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getRequestStatusText = (status) => {
    const texts = {
      'новая': '🆕 Новая',
      'в работе': '⚙️ В работе',
      'выполнена': '✅ Выполнена',
      'отменена': '❌ Отменена'
    };
    return texts[status] || status;
  };

  if (ordersLoading || requestsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
        <h3 style={{ color: '#c41e3a' }}>Загрузка...</h3>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        {/* Шапка профиля */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
          padding: '40px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#c41e3a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}>
              👤
            </div>
            <div>
              <h1 style={{ marginBottom: '8px' }}>{user.username}</h1>
              <p style={{ color: '#ccc', marginBottom: '5px' }}>{user.email}</p>
              <p style={{ color: '#ccc' }}>{user.phone || 'Телефон не указан'}</p>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', padding: '0 20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '15px 25px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === 'orders' ? 'bold' : 'normal',
              color: activeTab === 'orders' ? '#c41e3a' : '#666',
              borderBottom: activeTab === 'orders' ? '2px solid #c41e3a' : 'none'
            }}
          >
            📦 Мои заказы ({orders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              padding: '15px 25px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === 'favorites' ? 'bold' : 'normal',
              color: activeTab === 'favorites' ? '#c41e3a' : '#666',
              borderBottom: activeTab === 'favorites' ? '2px solid #c41e3a' : 'none'
            }}
          >
            ❤️ Избранное ({favorites?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '15px 25px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === 'requests' ? 'bold' : 'normal',
              color: activeTab === 'requests' ? '#c41e3a' : '#666',
              borderBottom: activeTab === 'requests' ? '2px solid #c41e3a' : 'none'
            }}
          >
            ✉️ Мои заявки ({requests?.length || 0})
          </button>
        </div>

        {/* Контент */}
        <div style={{ padding: '30px' }}>
          {/* Заказы */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#1a1a1a' }}>История заказов</h3>
              {orders && orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '15px' }}>
                      <div>
                        <strong>Заказ №{order.id}</strong>
                        <span style={{ marginLeft: '15px', color: '#666', fontSize: '14px' }}>
                          от {new Date(order.order_date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: getStatusColor(order.status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p><strong>Сумма:</strong> {order.total_amount} ₽</p>
                    <p><strong>Адрес доставки:</strong> {order.delivery_address || 'Не указан'}</p>
                    <p><strong>Телефон:</strong> {order.phone || 'Не указан'}</p>
                    {order.notes && <p><strong>Примечание:</strong> {order.notes}</p>}
                    <details style={{ marginTop: '10px' }}>
                      <summary style={{ cursor: 'pointer', color: '#c41e3a' }}>Состав заказа</summary>
                      <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                        {order.items && order.items.map(item => (
                          <div key={item.id} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                            {item.name} x {item.quantity} = {item.price_at_time * item.quantity} ₽
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  У вас пока нет заказов
                </p>
              )}
            </div>
          )}

          {/* Избранное */}
          {activeTab === 'favorites' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#1a1a1a' }}>Избранные товары</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {favorites && favorites.length > 0 ? (
                  favorites.map(item => (
                    <div key={item.id} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'center'
                    }}>
                      <img 
                        src={item.image_url || 'https://via.placeholder.com/150x150?text=Нет+фото'} 
                        alt={item.name}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                      />
                      <h4 style={{ marginBottom: '8px' }}>{item.name}</h4>
                      <p style={{ color: '#c41e3a', fontWeight: 'bold', marginBottom: '10px' }}>{item.price} ₽</p>
                      <Link
                        to={`/catalog`}
                        style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          background: '#c41e3a',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        Перейти в каталог
                      </Link>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                    У вас пока нет избранных товаров
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Заявки в ателье */}
          {activeTab === 'requests' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#1a1a1a' }}>Мои заявки</h3>
              {requests && requests.length > 0 ? (
                requests.map(request => (
                  <div key={request.id} style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '15px' }}>
                      <div>
                        <strong>Заявка №{request.id}</strong>
                        <span style={{ marginLeft: '15px', color: '#666', fontSize: '14px' }}>
                          от {new Date(request.request_date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: getRequestStatusColor(request.status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getRequestStatusText(request.status)}
                      </span>
                    </div>
                    <p><strong>Тип услуги:</strong> {
                      request.service_type === 'ремонт' ? '🔧 Ремонт' : 
                      request.service_type === 'пошив' ? '✂️ Пошив' : 
                      '📏 Подгонка'
                    }</p>
                    <p><strong>Описание:</strong> {request.description}</p>
                    <p><strong>Контактный телефон:</strong> {request.contact_phone}</p>
                    {request.photo_url && (
                      <p><strong>Фото:</strong> <a href={`http://localhost:8080${request.photo_url}`} target="_blank" rel="noreferrer" style={{ color: '#c41e3a' }}>Посмотреть</a></p>
                    )}
                    {request.admin_notes && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: '#f0f0f0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}>
                        <strong>💬 Комментарий администратора:</strong> {request.admin_notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  У вас пока нет заявок
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}