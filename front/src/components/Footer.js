import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#1a1a1a',
      color: '#e0e0e0',
      padding: '40px 20px 20px',
      marginTop: '50px',
      borderTop: '3px solid  #c41e3a'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px'
      }}>
        <div>
          <h3 style={{ color: ' #c41e3a', marginBottom: '15px', fontSize: '1.2rem' }}>Форма №8</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#aaa' }}>
            Профессиональная спецодежда и услуги ателье в Коврове с 2010 года.
          </p>
        </div>

        <div>
          <h3 style={{ color: ' #c41e3a', marginBottom: '15px', fontSize: '1.2rem' }}>Контакты</h3>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>📍 г. Ковров, ул. Ленина, д. 10</p>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>📞 +7 (900) 123-45-67</p>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>📧 info@forma8.ru</p>
        </div>

        <div>
          <h3 style={{ color: ' #c41e3a', marginBottom: '15px', fontSize: '1.2rem' }}>Режим работы</h3>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>Пн-Пт: 9:00 - 19:00</p>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>Сб: 10:00 - 16:00</p>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>Вс: выходной</p>
        </div>

        <div>
          <h3 style={{ color: ' #c41e3a', marginBottom: '15px', fontSize: '1.2rem' }}>Мы в соцсетях</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '24px' }}>📘</a>
            <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '24px' }}>📸</a>
            <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '24px' }}>📱</a>
          </div>
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#888'
      }}>
        <p>© 2025 Ателье спецодежды "Форма №8". Все права защищены.</p>
        <p>Студент: Торопова П.Р. | Группа: ИРсп-123</p>
      </div>
    </footer>
  );
}