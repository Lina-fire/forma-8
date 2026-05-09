import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      image: '/images/slider1.jpg',  
      title: 'Качественная спецодежда',
      subtitle: 'Для защиты в любых условиях',
      buttonText: 'Перейти в каталог',
      buttonLink: '/catalog'
    },
    {
      id: 2,
      image: '/images/slider2.jpg',  
      title: 'Индивидуальный пошив',
      subtitle: 'Создадим форму по вашим размерам',
      buttonText: 'Оставить заявку',
      buttonLink: '/atelier'
    },
    {
      id: 3,
      image: '/images/slider3.jpg', 
      title: 'Профессиональный ремонт',
      subtitle: 'Быстро и качественно',
      buttonText: 'Узнать больше',
      buttonLink: '/atelier'
    }
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      style={{ borderRadius: '0', height: '500px' }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '500px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)'
            }} />
            <div style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              padding: '20px'
            }}>
              <h1 style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: '1.2rem',
                marginBottom: '30px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                {slide.subtitle}
              </p>
              <a
                href={slide.buttonLink}
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#c41e3a',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#a01830'}
                onMouseLeave={(e) => e.target.style.background = '#c41e3a'}
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;