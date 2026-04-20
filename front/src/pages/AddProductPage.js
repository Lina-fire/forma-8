import React from 'react';
import { useTheme } from '../context/ThemeContext';
import AddProductForm from '../components/AddProductForm';
import { useNavigate } from 'react-router-dom';

function AddProductPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const sectionStyle = {
    background: theme === 'light' ? 'white' : '#2d2d2d',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: theme === 'light'
      ? '0 8px 20px rgba(0,0,0,0.05)'
      : '0 8px 20px rgba(0,0,0,0.3)',
  };

  const titleStyle = {
    color: theme === 'light' ? '#0f3952' : '#a8d8ff',
    fontSize: '1.5rem',
    marginBottom: '25px',
    borderBottom: theme === 'light' ? '2px dashed #dee7f0' : '2px dashed #444',
  };

  const handleProductAdded = () => {
    // После успешного добавления товара показываем уведомление
    // и предлагаем перейти в каталог
    const goToCatalog = window.confirm('Товар успешно добавлен! Перейти в каталог?');
    if (goToCatalog) {
      navigate('/catalog');
    }
  };

  return (
    <div style={sectionStyle}>
      <h2 style={titleStyle}>Добавление нового товара</h2>
      <AddProductForm onProductAdded={handleProductAdded} />
    </div>
  );
}

export default AddProductPage;