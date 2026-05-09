import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchAllProducts } from '../store/slices/productsSlice';
import { addToCart, removeFromCart, fetchCart, updateCartQuantity } from '../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../store/slices/favoritesSlice';
import { motion, AnimatePresence } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { list: products, totalCount, loading } = useSelector(state => state.products);
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: favItems } = useSelector(state => state.favorites);
  const { user } = useSelector(state => state.auth);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [notification, setNotification] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState({});
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

  useEffect(() => {
    if (cartItems.length > 0) {
      const initialQuantities = {};
      cartItems.forEach(item => {
        initialQuantities[item.product_id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cartItems]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  const isInFavorites = (productId) => {
    return favItems.some(item => item.product_id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.product_id === productId);
  };

  const getImageUrl = (product) => {
    if (!product.image_url) {
      return 'https://via.placeholder.com/300x200?text=Нет+фото';
    }
    if (product.image_url.startsWith('http')) {
      return product.image_url;
    }
    if (product.image_url.startsWith('/uploads')) {
      return `http://localhost:8080${product.image_url}`;
    }
    if (product.image_url.startsWith('/images')) {
      return product.image_url;
    }
    return product.image_url;
  };

  const handleQuantityChange = async (productId, newQuantity, product) => {
    if (!user) {
      showNotification('Войдите, чтобы управлять корзиной', 'error');
      return;
    }

    if (newQuantity < 1) {
      await handleRemoveFromCart(productId);
      return;
    }

    // Проверка наличия на складе
    if (newQuantity > product.stock_quantity) {
      showNotification(`Доступно только ${product.stock_quantity} шт. товара "${product.name}"`, 'error');
      return;
    }

    setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    
    try {
      await dispatch(updateCartQuantity({ product_id: productId, quantity: newQuantity }));
      await dispatch(fetchCart());
      showNotification('Количество обновлено');
    } catch (error) {
      showNotification(error.response?.data?.error || 'Ошибка обновления количества', 'error');
      // Возвращаем предыдущее количество
      const cartItem = getCartItem(productId);
      if (cartItem) {
        setQuantities(prev => ({ ...prev, [productId]: cartItem.quantity }));
      }
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      showNotification('Войдите, чтобы добавить товар в корзину', 'error');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await dispatch(addToCart(product.id));
      await dispatch(fetchCart());
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
      showNotification(`"${product.name}" добавлен в корзину`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Ошибка добавления в корзину';
      showNotification(errorMsg, 'error');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await dispatch(removeFromCart(productId));
      await dispatch(fetchCart());
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      });
      showNotification('Товар удален из корзины');
    } catch (error) {
      showNotification('Ошибка удаления из корзины', 'error');
    }
  };

  const handleAddToFavorites = async (product) => {
    if (!user) {
      showNotification('Войдите, чтобы добавить товар в избранное', 'error');
      return;
    }

    try {
      if (isInFavorites(product.id)) {
        await dispatch(removeFromFavorites(product.id));
        showNotification(`"${product.name}" удален из избранного`);
      } else {
        await dispatch(addToFavorites(product.id));
        showNotification(`"${product.name}" добавлен в избранное`);
      }
      await dispatch(fetchFavorites());
    } catch (error) {
      showNotification('Ошибка', 'error');
    }
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return '0 ₽';
    // Округляем до целого числа, если цена целая
    if (num === Math.floor(num)) {
      return `${Math.floor(num)} ₽`;
    }
    return `${num.toFixed(2)} ₽`;
  };

  const toggleDescription = (productId) => {
    setExpandedDesc(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const totalPages = Math.ceil(totalCount / productsPerPage);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ color: '#c41e3a', fontSize: '1.2rem' }}>Загрузка товаров...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      paddingTop: '20px',
      paddingBottom: '40px',
      paddingLeft: '20px',
      paddingRight: '20px',
      maxWidth: '1400px', 
      margin: '0 auto',
      position: 'relative'
    }}>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              zIndex: 1000,
              padding: '12px 24px',
              borderRadius: '8px',
              background: notification.type === 'error' ? '#dc3545' : '#28a745',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxWidth: '350px',
              wordBreak: 'break-word'
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 style={{ 
        color: '#1a1a1a', 
        borderBottom: '2px solid #c41e3a', 
        paddingBottom: '10px', 
        marginBottom: '25px',
        marginTop: 0,
        fontSize: '1.8rem'
      }}>
        Каталог спецодежды
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {products.map((product) => {
          const quantity = quantities[product.id] || 0;
          const isProductInCart = isInCart(product.id);
          const imageUrl = getImageUrl(product);
          const isExpanded = expandedDesc[product.id] || false;
          const description = product.description || 'Описание отсутствует';
          const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s'
              }}
            >
              {/* Изображение - fit contain чтобы не обрезалось */}
              <div style={{ position: 'relative', height: '220px', marginBottom: '15px' }}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Нет+фото';
                  }}
                />
                
                <button
                  onClick={() => handleAddToFavorites(product)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isInFavorites(product.id) ? 
                    <FavoriteIcon style={{ color: '#c41e3a' }} /> : 
                    <FavoriteBorderIcon style={{ color: '#999' }} />
                  }
                </button>
              </div>

              <h3 style={{ 
                color: '#1a1a1a', 
                marginBottom: '8px', 
                fontSize: '1rem',
                fontWeight: '600',
                minHeight: '48px'
              }}>
                {product.name}
              </h3>
              
              {/* Описание с кнопкой "развернуть" */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ 
                  color: '#666', 
                  fontSize: '13px', 
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {isExpanded ? description : shortDesc}
                </p>
                {description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(product.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c41e3a',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginTop: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isExpanded ? (
                      <>Свернуть <ExpandLessIcon style={{ fontSize: '16px' }} /></>
                    ) : (
                      <>Развернуть <ExpandMoreIcon style={{ fontSize: '16px' }} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Характеристики */}
              <div style={{ 
                marginBottom: '15px', 
                fontSize: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {product.size && (
                  <span style={{ 
                    background: '#f0f0f0', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    color: '#666'
                  }}>
                    📏 {product.size}
                  </span>
                )}
                {product.color && (
                  <span style={{ 
                    background: '#f0f0f0', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    color: '#666'
                  }}>
                    🎨 {product.color}
                  </span>
                )}
                {product.material && (
                  <span style={{ 
                    background: '#f0f0f0', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    color: '#666'
                  }}>
                    🧵 {product.material}
                  </span>
                )}
              </div>

              {/* Цена и остаток */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'baseline',
                marginBottom: '15px'
              }}>
                <span style={{ 
                  color: '#c41e3a', 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold' 
                }}>
                  {formatPrice(product.price)}
                </span>
                {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                  <span style={{ 
                    color: '#ff9800', 
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    ⚡ Осталось {product.stock_quantity} шт.
                  </span>
                )}
                {product.stock_quantity === 0 && (
                  <span style={{ 
                    color: '#999', 
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    ❌ Нет в наличии
                  </span>
                )}
              </div>

              {/* Управление корзиной */}
              {isProductInCart && quantity > 0 ? (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  padding: '8px',
                  marginTop: '10px'
                }}>
                  <button
                    onClick={() => handleQuantityChange(product.id, quantity - 1, product)}
                    disabled={addingToCart[product.id]}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#c41e3a',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <RemoveIcon />
                  </button>
                  
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(product.id, quantity + 1, product)}
                    disabled={addingToCart[product.id] || product.stock_quantity === 0 || quantity >= product.stock_quantity}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      background: (product.stock_quantity > 0 && quantity < product.stock_quantity) ? '#c41e3a' : '#ccc',
                      color: 'white',
                      cursor: (product.stock_quantity > 0 && quantity < product.stock_quantity) ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <AddIcon />
                  </button>

                  <button
                    onClick={() => handleRemoveFromCart(product.id)}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#999',
                      transition: 'all 0.2s'
                    }}
                  >
                    <DeleteIcon style={{ fontSize: '20px' }} />
                    <span style={{ fontSize: '12px' }}>Удалить</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart[product.id] || product.stock_quantity === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: product.stock_quantity > 0 ? '#c41e3a' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: product.stock_quantity > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    marginTop: '10px'
                  }}
                >
                  {addingToCart[product.id] ? (
                    'Добавление...'
                  ) : (
                    <>
                      <ShoppingCartIcon style={{ fontSize: '18px' }} />
                      В корзину
                    </>
                  )}
                </button>
              )}

              {isProductInCart && quantity > 0 && (
                <div style={{
                  marginTop: '10px',
                  fontSize: '11px',
                  color: '#28a745',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}>
                  <CheckCircleIcon style={{ fontSize: '14px' }} />
                  В корзине: {quantity} шт.
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          marginTop: '40px', 
          flexWrap: 'wrap' 
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              background: currentPage === 1 ? '#e0e0e0' : '#c41e3a',
              color: currentPage === 1 ? '#999' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Назад
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '10px 16px',
                minWidth: '40px',
                background: currentPage === i + 1 ? '#c41e3a' : '#f0f0f0',
                color: currentPage === i + 1 ? 'white' : '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: currentPage === i + 1 ? 'bold' : 'normal'
              }}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              background: currentPage === totalPages ? '#e0e0e0' : '#c41e3a',
              color: currentPage === totalPages ? '#999' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  );
}