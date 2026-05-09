import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartQuantity } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (items.length > 0) {
      const initialQuantities = {};
      items.forEach(item => {
        initialQuantities[item.product_id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [items]);

  const getImageUrl = (item) => {
    if (!item.image_url) {
      return 'https://via.placeholder.com/100x100?text=Нет+фото';
    }
    if (item.image_url.startsWith('http')) {
      return item.image_url;
    }
    if (item.image_url.startsWith('/uploads')) {
      return `http://localhost:8080${item.image_url}`;
    }
    return item.image_url;
  };

  const handleQuantityChange = async (productId, newQuantity, item) => {
    if (newQuantity < 1) {
      await handleRemoveFromCart(productId);
      return;
    }

    if (newQuantity > item.stock_quantity) {
      setError(`Доступно только ${item.stock_quantity} шт. товара "${item.name}"`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    
    try {
      await dispatch(updateCartQuantity({ product_id: productId, quantity: newQuantity }));
      await dispatch(fetchCart());
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка обновления количества');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    await dispatch(removeFromCart(productId));
    await dispatch(fetchCart());
  };

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

  const total = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleOrder = async () => {
    const address = prompt('Введите адрес доставки:');
    if (!address) return;
    await dispatch(createOrder({ delivery_address: address, phone: user?.phone || '', notes: '' }));
    alert('Заказ оформлен!');
    dispatch(fetchCart());
    navigate('/catalog');
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return '0 ₽';
    if (num === Math.floor(num)) {
      return `${Math.floor(num)} ₽`;
    }
    return `${num.toFixed(2)} ₽`;
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a1a', borderBottom: '2px solid #c41e3a', paddingBottom: '10px', marginBottom: '30px' }}>
        Корзина
      </h1>
      
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
      
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {items.map(item => {
          const quantity = quantities[item.product_id] || item.quantity;
          return (
            <div key={item.product_id} style={{
              borderBottom: '1px solid #eee',
              padding: '15px',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              {/* Картинка */}
              <img
                src={getImageUrl(item)}
                alt={item.name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  background: '#f8f9fa'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=Нет+фото';
                }}
              />
              
              {/* Информация о товаре */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ color: '#333', marginBottom: '8px' }}>{item.name}</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '5px' }}>
                  {item.description?.substring(0, 100)}...
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {item.size && <span style={{ fontSize: '12px', color: '#888' }}>📏 {item.size}</span>}
                  {item.color && <span style={{ fontSize: '12px', color: '#888' }}>🎨 {item.color}</span>}
                  {item.material && <span style={{ fontSize: '12px', color: '#888' }}>🧵 {item.material}</span>}
                </div>
                <p style={{ color: '#c41e3a', fontWeight: 'bold', marginTop: '8px' }}>
                  {formatPrice(item.price)} / шт.
                </p>
              </div>
              
              {/* Управление количеством */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleQuantityChange(item.product_id, quantity - 1, item)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#c41e3a',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RemoveIcon style={{ fontSize: '18px' }} />
                </button>
                
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.product_id, quantity + 1, item)}
                  disabled={quantity >= item.stock_quantity}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: quantity < item.stock_quantity ? '#c41e3a' : '#ccc',
                    color: 'white',
                    cursor: quantity < item.stock_quantity ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AddIcon style={{ fontSize: '18px' }} />
                </button>
                
                <button
                  onClick={() => handleRemoveFromCart(item.product_id)}
                  style={{
                    padding: '8px 16px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginLeft: '10px'
                  }}
                >
                  <DeleteIcon style={{ fontSize: '18px' }} />
                  Удалить
                </button>
              </div>
              
              {/* Сумма за позицию */}
              <div style={{ minWidth: '100px', textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#c41e3a' }}>
                  {formatPrice(item.price * quantity)}
                </p>
                {item.stock_quantity < 5 && (
                  <p style={{ fontSize: '11px', color: '#ff9800' }}>
                    Осталось {item.stock_quantity} шт.
                  </p>
                )}
              </div>
            </div>
          );
        })}
        
        <div style={{ marginTop: '20px', textAlign: 'right', padding: '15px', borderTop: '2px solid #c41e3a' }}>
          <h2 style={{ color: '#333' }}>Итого: {formatPrice(total)}</h2>
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