const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const routes = require('./routes');

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр Express приложения
const app = express();

// Настройка CORS
app.use(cors({ origin: '*' }));

// Парсинг JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (загруженные изображения)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение маршрутов API
app.use('/api', routes);

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`📍 API доступно по адресу: http://localhost:${PORT}/api`);
});