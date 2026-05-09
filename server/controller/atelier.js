const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Папка для загрузок
const uploadDir = path.join(__dirname, '../uploads/atelier');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

exports.upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('photo');

// Настройка почты с вашим паролем приложения
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'polinatoropova1212@mail.ru',
    pass: 'bl7BfhvawR4bvY5BrL7l'
  }
});

// Проверка подключения к почте
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Ошибка подключения к почте:', error.message);
  } else {
    console.log('✅ Почтовый сервер настроен и готов к отправке');
  }
});

// Отправка уведомления администратору о новой заявке
async function notifyAdminAboutRequest(request, user) {
  console.log(`📧 Отправка уведомления админу о заявке №${request.id}...`);
  
  try {
    const info = await transporter.sendMail({
      from: 'polinatoropova1212@mail.ru',
      to: 'polinatoropova1212@mail.ru',
      subject: `✉️ НОВАЯ ЗАЯВКА В АТЕЛЬЕ №${request.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #c41e3a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✂️ АТЕЛЬЕ "ФОРМА №8"</h2>
              <p>НОВАЯ ЗАЯВКА!</p>
            </div>
            <div class="content">
              <h3>Заявка №${request.id}</h3>
              <p><strong>Клиент:</strong> ${user?.username || 'Неизвестный'}</p>
              <p><strong>Email клиента:</strong> ${user?.email || 'не указан'}</p>
              <p><strong>Телефон:</strong> ${request.contact_phone}</p>
              <p><strong>Тип услуги:</strong> ${request.service_type === 'ремонт' ? '🔧 Ремонт' : request.service_type === 'пошив' ? '✂️ Индивидуальный пошив' : '📏 Подгонка по фигуре'}</p>
              <p><strong>Описание:</strong> ${request.description}</p>
              ${request.photo_url ? `<p><strong>Фото:</strong> <a href="http://localhost:8080${request.photo_url}">Посмотреть фото</a></p>` : ''}
              <hr>
              <p><a href="http://localhost:3000/admin/requests">👉 ПЕРЕЙТИ В АДМИН-ПАНЕЛЬ</a></p>
            </div>
            <div class="footer">
              <p>© 2025 Ателье спецодежды "Форма №8"</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Уведомление о заявке №${request.id} отправлено администратору`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки уведомления админу:', error.message);
    return false;
  }
}

// Создание заявки
exports.createRequest = async (req, res) => {
  console.log('📝 Создание заявки в ателье, userId:', req.userId);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  try {
    const { service_type, description, contact_phone } = req.body;
    const photo_url = req.file ? `/uploads/atelier/${req.file.filename}` : null;
    
    const [request] = await db('atelier_requests').insert({
      user_id: req.userId,
      service_type,
      description,
      photo_url,
      contact_phone,
      status: 'новая'
    }).returning('*');
    
    console.log('✅ Заявка создана в БД, ID:', request.id);
    
    // Получаем данные пользователя
    const user = await db('users').where('id', req.userId).first();
    console.log('👤 Пользователь:', user?.username, user?.email);
    
    // 📧 ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ АДМИНИСТРАТОРУ
    await notifyAdminAboutRequest(request, user);
    
    res.json({ message: 'Заявка отправлена', request });
  } catch (error) {
    console.error('❌ Ошибка создания заявки:', error);
    res.status(500).json({ error: 'Ошибка при создании заявки: ' + error.message });
  }
};

// Получить заявки пользователя
exports.getUserRequests = async (req, res) => {
  console.log('📋 Запрос заявок пользователя:', req.userId);
  
  try {
    const requests = await db('atelier_requests')
      .where('user_id', req.userId)
      .orderBy('request_date', 'desc');
    
    console.log(`📋 Найдено заявок: ${requests.length}`);
    res.json({ requests });
  } catch (error) {
    console.error('❌ Ошибка получения заявок:', error);
    res.status(500).json({ error: 'Ошибка получения заявок' });
  }
};

// Получить все заявки (админ)
exports.getAllRequests = async (req, res) => {
  console.log('📋 Запрос всех заявок (админ)');
  
  try {
    const requests = await db('atelier_requests')
      .leftJoin('users', 'atelier_requests.user_id', 'users.id')
      .select('atelier_requests.*', 'users.username', 'users.email')
      .orderBy('request_date', 'desc');
    
    console.log(`📋 Найдено заявок: ${requests.length}`);
    res.json({ requests });
  } catch (error) {
    console.error('❌ Ошибка получения заявок:', error);
    res.status(500).json({ error: 'Ошибка получения заявок' });
  }
};

// Обновить статус заявки
exports.updateStatus = async (req, res) => {
  console.log(`📝 Обновление статуса заявки ${req.params.requestId} -> ${req.body.status}`);
  
  try {
    const [request] = await db('atelier_requests')
      .where('id', req.params.requestId)
      .update({ 
        status: req.body.status, 
        admin_notes: req.body.admin_notes,
        updated_at: new Date()
      })
      .returning('*');
    
    // Отправляем уведомление клиенту
    if (request && request.user_id) {
      const user = await db('users').where('id', request.user_id).first();
      if (user && user.email) {
        await transporter.sendMail({
          from: 'polinatoropova1212@mail.ru',
          to: user.email,
          subject: `📝 Статус заявки №${request.id} изменен`,
          html: `
            <h2>Статус вашей заявки №${request.id} изменен!</h2>
            <p><strong>Новый статус:</strong> ${request.status}</p>
            ${request.admin_notes ? `<p><strong>Комментарий администратора:</strong> ${request.admin_notes}</p>` : ''}
            <p>Следите за обновлениями в <a href="http://localhost:3000/profile">личном кабинете</a>.</p>
          `
        });
        console.log(`✅ Уведомление отправлено клиенту ${user.email}`);
      }
    }
    
    res.json({ message: 'Статус обновлён', request });
  } catch (error) {
    console.error('❌ Ошибка обновления статуса:', error);
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};

// Добавьте эту функцию после функции notifyAdminAboutRequest
// Отправка уведомления КЛИЕНТУ о создании заявки
async function notifyUserAboutRequest(request, user) {
  if (!user?.email) {
    console.log('⚠️ Нет email у пользователя, пропускаем уведомление');
    return false;
  }
  
  console.log(`📧 Отправка уведомления клиенту ${user.email} о заявке №${request.id}...`);
  
  const serviceTypeText = {
    'ремонт': '🔧 Ремонт одежды',
    'пошив': '✂️ Индивидуальный пошив',
    'подгонка': '📏 Подгонка по фигуре'
  };
  
  try {
    const info = await transporter.sendMail({
      from: 'polinatoropova1212@mail.ru',
      to: user.email,
      subject: `✅ Заявка №${request.id} принята`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ ЗАЯВКА ПРИНЯТА!</h2>
            </div>
            <div class="content">
              <h3>Здравствуйте, ${user.username}!</h3>
              <p>Ваша заявка <strong>№${request.id}</strong> успешно принята.</p>
              <p><strong>Тип услуги:</strong> ${serviceTypeText[request.service_type] || request.service_type}</p>
              <p><strong>Описание:</strong> ${request.description}</p>
              <p><strong>Статус:</strong> ${request.status === 'новая' ? '🆕 Новая' : request.status}</p>
              <hr>
              <p>Статус заявки можно отслеживать в <a href="http://localhost:3000/profile">личном кабинете</a>.</p>
              <p>Мы свяжемся с вами в ближайшее время!</p>
            </div>
            <div class="footer">
              <p>© 2025 Ателье спецодежды "Форма №8"</p>
              <p>г. Ковров, ул. Ленина, д. 10 | +7 (900) 123-45-67</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Уведомление отправлено клиенту ${user.email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки клиенту:', error.message);
    return false;
  }
}

// Функция уведомления клиента об изменении статуса
async function notifyUserAboutStatusChange(request, user, newStatus, adminNotes) {
  if (!user?.email) return false;
  
  console.log(`📧 Отправка уведомления клиенту ${user.email} об изменении статуса заявки №${request.id}...`);
  
  const statusText = {
    'новая': '🆕 Новая',
    'в работе': '⚙️ В работе',
    'выполнена': '✅ Выполнена',
    'отменена': '❌ Отменена'
  };
  
  try {
    const info = await transporter.sendMail({
      from: 'polinatoropova1212@mail.ru',
      to: user.email,
      subject: `📝 Статус заявки №${request.id} изменен`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #c41e3a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📝 СТАТУС ЗАЯВКИ ИЗМЕНЕН</h2>
            </div>
            <div class="content">
              <h3>Здравствуйте, ${user.username}!</h3>
              <p>Статус вашей заявки <strong>№${request.id}</strong> изменился:</p>
              <p><strong>Новый статус:</strong> ${statusText[newStatus] || newStatus}</p>
              ${adminNotes ? `<p><strong>Комментарий администратора:</strong><br>${adminNotes}</p>` : ''}
              <hr>
              <p>Подробную информацию можно посмотреть в <a href="http://localhost:3000/profile">личном кабинете</a>.</p>
            </div>
            <div class="footer">
              <p>© 2025 Ателье спецодежды "Форма №8"</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Уведомление о статусе отправлено клиенту ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки уведомления о статусе:', error.message);
    return false;
  }
}