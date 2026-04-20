import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ArrayDisplay from '../components/ArrayDisplay';
import CounterWithEffect from '../components/CounterWithEffect';
import CartTracker from '../components/CartTracker';

function AboutPage() {
  const { theme } = useTheme();

  const productsArray = [
    { id: 1, name: 'Костюм "КАРАТ"', price: 1300, size: '48-50', color: 'синий' },
    { id: 2, name: 'Брюки рабочие', price: 500, size: '52-54', color: 'серый' },
    { id: 3, name: 'Зимний костюм "Арктика"', price: 2500, size: '56', color: 'хаки' },
  ];

  const sectionStyle = {
    background: theme === 'light' ? 'white' : '#2d2d2d',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '30px',
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

  return (
    <div>
      <div style={sectionStyle}>
        <h2 style={titleStyle}>О нашем ателье</h2>
        <p style={{ color: theme === 'light' ? '#333' : '#e0e0e0' }}>
          Ателье спецодежды "Форма №8" работает на рынке с 2010 года. 
          Мы специализируемся на пошиве качественной спецодежды для различных отраслей промышленности.
        </p>
        <p style={{ color: theme === 'light' ? '#333' : '#e0e0e0' }}>
          <strong>Адрес:</strong> г. Владимир, ул. Студенческая, д. 10<br />
          <strong>Телефон:</strong> +7 (4922) 77-77-77<br />
          <strong>Email:</strong> info@forma8.ru
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>Примеры нашей продукции</h2>
        <ArrayDisplay products={productsArray} />
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>Демонстрация работы React</h2>
        <CounterWithEffect initialCount={5} />
        <div style={{ marginTop: '20px' }}>
          <CartTracker />
        </div>
      </div>
    </div>
  );
}

export default AboutPage;