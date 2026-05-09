import React from 'react';
import { motion } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function HomePage() {
  const { user } = useSelector(state => state.auth);

  const features = [
    { icon: '🛡️', title: 'Качественные материалы', desc: 'Используем только проверенные ткани и фурнитуру' },
    { icon: '👔', title: 'Индивидуальный подход', desc: 'Учтем все ваши пожелания и особенности' },
    { icon: '⚡', title: 'Быстрая обработка', desc: 'Заказы обрабатываются в течение 24 часов' },
    { icon: '📦', title: 'Доставка по России', desc: 'Отправляем заказы во все регионы' }
  ];

  const services = [
    { title: 'Прода', desc: 'Широкий ассортимент готовой продукции', link: '/catalog' },
    { title: 'Индивидуальный пошив', desc: 'Пошив по вашим размерам и эскизам', link: '/atelier' },
    { title: 'Ремонт одежды', desc: 'Качественный ремонт любой сложности', link: '/atelier' },
    { title: 'Нанесение логотипов', desc: 'Брендирование спецодежды', link: '/atelier' }
  ];

  return (
    <div>
      <HeroSlider />

      {/* О компании - анимация */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          padding: '60px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <h2 style={{
          color: '#1a1a1a',
          fontSize: '2rem',
          marginBottom: '20px',
          position: 'relative',
          display: 'inline-block'
        }}>
          О компании
          <span style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: '#c41e3a'
          }} />
        </h2>
        <p style={{
          maxWidth: '800px',
          margin: '30px auto 0',
          color: '#666',
          lineHeight: '1.8',
          fontSize: '1rem'
        }}>
          Ателье спецодежды "Форма №8" работает на рынке с 2010 года. 
          Мы специализируемся на пошиве качественной спецодежды для 
          различных отраслей промышленности. Наша цель - обеспечить 
          комфорт и безопасность работников.
        </p>
      </motion.div>

      {/* Преимущества - анимация с задержкой */}
      <div style={{
        background: '#f8f8f8',
        padding: '60px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              style={{
                textAlign: 'center',
                padding: '30px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{feature.icon}</div>
              <h3 style={{ color: '#1a1a1a', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Услуги - анимация */}
      <div style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            color: '#1a1a1a',
            fontSize: '2rem',
            marginBottom: '40px'
          }}
        >
          Наши услуги
        </motion.h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <Link
                to={service.link}
                style={{
                  textDecoration: 'none',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  display: 'block',
                  cursor: 'pointer'
                }}
              >
                <h3 style={{ color: '#1a1a1a', marginBottom: '15px' }}>{service.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{service.desc}</p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  color: '#c41e3a',
                  fontWeight: 'bold'
                }}>
                  Подробнее →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Блок - анимация */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
          padding: '60px 20px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '15px' }}>
            Готовы сделать заказ?
          </h2>
          <p style={{ color: '#ccc', marginBottom: '30px' }}>
            Оставьте заявку, и мы свяжемся с вами в ближайшее время
          </p>
          {!user ? (
            <div>
              <Link
                to="/register"
                style={{
                  display: 'inline-block',
                  padding: '14px 40px',
                  background: '#c41e3a',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '40px',
                  fontWeight: 'bold',
                  margin: '0 10px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#a01830'}
                onMouseLeave={(e) => e.target.style.background = '#c41e3a'}
              >
                Зарегистрироваться
              </Link>
              <Link
                to="/catalog"
                style={{
                  display: 'inline-block',
                  padding: '14px 40px',
                  background: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '40px',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  margin: '0 10px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                В каталог
              </Link>
            </div>
          ) : (
            <Link
              to="/catalog"
              style={{
                display: 'inline-block',
                padding: '14px 40px',
                background: '#c41e3a',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '40px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#a01830'}
              onMouseLeave={(e) => e.target.style.background = '#c41e3a'}
            >
              Перейти в каталог
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}