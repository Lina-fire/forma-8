import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#1a1a1a' }}>Войдите, чтобы просмотреть корзину</h2>
        <Link to="/login" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 24px',
          background: '#c41e3a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px'
        }}>Войти</Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}><h3 style={{ color: '#c41e3a' }}>Загрузка...</h3></div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#1a1a1a' }}>Корзина пуста</h2>
        <Link to="/catalog" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 24px',
          background: '#c41e3a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px'
        }}>Перейти в каталог</Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleOrder = async () => {
    const address = prompt('Введите адрес доставки:');
    if (!address) return;
    await dispatch(createOrder({ delivery_address: address, phone: user.phone, notes: '' }));
    alert('Заказ оформлен!');
    dispatch(fetchCart());
    navigate('/catalog');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a1a', borderBottom: '2px solid #c41e3a', paddingBottom: '10px', marginBottom: '30px' }}>
        Корзина
      </h1>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {items.map(item => (
          <div key={item.product_id} style={{
            borderBottom: '1px solid #eee',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ color: '#333' }}>{item.name}</h3>
              <p style={{ color: '#666' }}>Количество: {item.quantity}</p>
              <p style={{ color: '#c41e3a', fontWeight: 'bold' }}>{item.price * item.quantity} ₽</p>
            </div>
            <button
              onClick={() => dispatch(removeFromCart(item.product_id))}
              style={{
                padding: '8px 16px',
                background: '#ff1a31',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Удалить
            </button>
          </div>
        ))}
        <div style={{ marginTop: '20px', textAlign: 'right', padding: '15px', borderTop: '2px solid #c41e3a' }}>
          <h2 style={{ color: '#333' }}>Итого: {total} ₽</h2>
          <button
            onClick={handleOrder}
            style={{
              marginTop: '15px',
              padding: '12px 30px',
              background: '#c41e3a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}