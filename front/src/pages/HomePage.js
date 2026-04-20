import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ConditionalOne from '../components/ConditionalOne';
import ConditionalTwo from '../components/ConditionalTwo';
import ExtraComponent from '../components/ExtraComponent';

function HomePage() {
  const { theme } = useTheme();

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
        <h2 style={titleStyle}>Добро пожаловать в ателье спецодежды "Форма №8"</h2>
        <p style={{ color: theme === 'light' ? '#333' : '#e0e0e0', fontSize: '1.1rem' }}>
          Мы предлагаем широкий ассортимент качественной спецодежды для различных отраслей промышленности.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>Наличие товаров</h2>
        <ConditionalOne />
        <div style={{ marginTop: '20px' }}>
          <ConditionalTwo />
        </div>
      </div>

      <div style={sectionStyle}>
        <ExtraComponent 
          title="Специальное предложение"
          discount="20% на первый заказ"
          endTime="30.04.2026"
        />
      </div>
    </div>
  );
}

export default HomePage;