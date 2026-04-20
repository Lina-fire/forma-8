import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchAllProducts } from '../store/slices/productsSlice';
import { addToCart, fetchCart } from '../store/slices/cartSlice';  // ← убрали removeFromCart
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../store/slices/favoritesSlice';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { list: products, totalCount, loading } = useSelector(state => state.products);
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: favItems } = useSelector(state => state.favorites);
  const { user } = useSelector(state => state.auth);
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const offset = (currentPage - 1) * productsPerPage;
    dispatch(fetchProducts({ offset, limit: productsPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  const isInCart = (productId) => cartItems.some(item => item.product_id === productId);
  const isInFavorites = (productId) => favItems.some(item => item.product_id === productId);

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Войдите, чтобы добавить товар в корзину');
      return;
    }
    await dispatch(addToCart(product.id));
    dispatch(fetchCart());
  };

  const handleAddToFavorites = async (product) => {
    if (!user) {
      alert('Войдите, чтобы добавить товар в избранное');
      return;
    }
    if (isInFavorites(product.id)) {
      await dispatch(removeFromFavorites(product.id));
    } else {
      await dispatch(addToFavorites(product.id));
    }
    dispatch(fetchFavorites());
  };

  const totalPages = Math.ceil(totalCount / productsPerPage);

  return (
    <div style={{ 
      paddingTop: '20px',
      paddingBottom: '40px',
      paddingLeft: '20px',
      paddingRight: '20px',
      maxWidth: '1400px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        color: '#1a4b6d', 
        borderBottom: '2px solid #c41e3a', 
        paddingBottom: '10px', 
        marginBottom: '25px',
        marginTop: 0,
        fontSize: '1.8rem'
      }}>
        Каталог спецодежды
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ color: '#666', fontSize: '1.2rem' }}>Загрузка...</div>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '15px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <img
                  src={product.image_url || 'https://via.placeholder.com/300x200?text=Нет+фото'}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                />
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '8px', 
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  {product.name}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '13px', 
                  marginBottom: '10px',
                  lineHeight: '1.4'
                }}>
                  {product.description?.substring(0, 70)}...
                </p>
                <div style={{ marginBottom: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#888' }}>Размер: {product.size || '-'}</span><br />
                  <span style={{ color: '#888' }}>Цвет: {product.color || '-'}</span><br />
                  <span style={{ color: '#888' }}>Материал: {product.material || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ 
                    color: '#c41e3a', 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold' 
                  }}>
                    {product.price} ₽
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleAddToFavorites(product)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '22px',
                        cursor: 'pointer',
                        color: isInFavorites(product.id) ? '#c41e3a' : '#ccc',
                        padding: '5px'
                      }}
                    >
                      {isInFavorites(product.id) ? '❤️' : '🤍'}
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        padding: '6px 14px',
                        background: isInCart(product.id) ? '#4f4f4f' : '#c41e3a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                      disabled={product.stock_quantity === 0}
                    >
                      {isInCart(product.id) ? '✅ В корзине' : '🛒 В корзину'}
                    </button>
                  </div>
                </div>
                {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                  <small style={{ color: '#c41e3a', display: 'block', marginTop: '10px', fontSize: '11px' }}>
                    Осталось {product.stock_quantity} шт.
                  </small>
                )}
                {product.stock_quantity === 0 && (
                  <small style={{ color: '#c41e3a', display: 'block', marginTop: '10px', fontSize: '11px' }}>
                    Нет в наличии
                  </small>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px', 
              marginTop: '30px', 
              flexWrap: 'wrap' 
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px',
                  background: currentPage === 1 ? '#e0e0e0' : '#c41e3a',
                  color: currentPage === 1 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px'
                }}
              >
                Назад
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    padding: '6px 12px',
                    minWidth: '32px',
                    background: currentPage === i + 1 ? '#c41e3a' : '#f0f0f0',
                    color: currentPage === i + 1 ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 12px',
                  background: currentPage === totalPages ? '#e0e0e0' : '#c41e3a',
                  color: currentPage === totalPages ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '13px'
                }}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}