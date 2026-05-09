import React, { useState, useEffect } from 'react';
import { fadeInDown, bounce, pulse } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeInDown,
    animationDuration: '0.5s',
  },
  bounce: {
    animationName: bounce,
    animationDuration: '0.5s',
  },
  pulse: {
    animationName: pulse,
    animationDuration: '0.3s',
  }
});

function CartTracker() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [animateAdd, setAnimateAdd] = useState(false);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Корзина обновлена:', cart);
  }, [cart]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const products = [
    { id: 1, name: 'Костюм "КАРАТ"', price: 1300 },
    { id: 2, name: 'Брюки рабочие', price: 500 },
    { id: 3, name: 'Зимний костюм "Арктика"', price: 2500 },
    { id: 4, name: 'Куртка утепленная', price: 1800 },
    { id: 5, name: 'Рукавицы рабочие', price: 150 }
  ];

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
    setAnimateAdd(true);
    setTimeout(() => setAnimateAdd(false), 300);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#1a4b6d', marginBottom: '20px' }}>
        Демонстрация корзины (useEffect)
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h4 style={{ marginBottom: '15px' }}>Товары:</h4>
          {products.map(product => (
            <div
              key={product.id}
              className={animateAdd ? css(styles.pulse) : ''}
              style={{
                padding: '10px',
                marginBottom: '10px',
                background: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong>{product.name}</strong>
                <br />
                <small>{product.price} ₽</small>
              </div>
              <button
                onClick={() => addToCart(product)}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>
        
        <div className={cart.length > 0 ? css(styles.bounce) : ''}>
          <h4 style={{ marginBottom: '15px' }}>
            Корзина: <span style={{ color: '#d94a2c' }}>{cart.length}</span>
          </h4>
          {cart.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              Корзина пуста
            </p>
          ) : (
            <>
              {cart.map(item => (
                <div
                  key={item.cartId}
                  className={css(styles.fadeIn)}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    background: '#e9ecef',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <br />
                    <small>{item.price} ₽</small>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: '#1a4b6d',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'right',
                fontSize: '1.2rem'
              }}>
                Итого: {total} ₽
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartTracker;