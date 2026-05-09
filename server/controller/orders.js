const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Настройка почтового транспорта с вашим паролем приложения
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'polinatoropova1212@mail.ru',
    pass: 'bl7BfhvawR4bvY5BrL7l'
  }
});

// Отправка уведомления администратору о новом заказе
async function notifyAdminAboutOrder(order, user) {
  console.log(`📧 Отправка уведомления админу о заказе №${order.id}...`);
  
  try {
    const info = await transporter.sendMail({
      from: 'polinatoropova1212@mail.ru',
      to: 'polinatoropova1212@mail.ru',
      subject: `🛒 НОВЫЙ ЗАКАЗ №${order.id}`,
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
              <h2>🛍️ ФОРМА №8</h2>
              <p>НОВЫЙ ЗАКАЗ!</p>
            </div>
            <div class="content">
              <h3>Заказ №${order.id}</h3>
              <p><strong>Клиент:</strong> ${user?.username || 'Гость'}</p>
              <p><strong>Email:</strong> ${user?.email || 'не указан'}</p>
              <p><strong>Телефон:</strong> ${order.phone}</p>
              <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
              <p><strong>Сумма заказа:</strong> ${order.total_amount} ₽</p>
              <p><strong>Статус:</strong> ${order.status}</p>
              <hr>
              <p><a href="http://localhost:3000/admin/orders">👉 ПЕРЕЙТИ В АДМИН-ПАНЕЛЬ</a></p>
            </div>
            <div class="footer">
              <p>© 2025 Ателье спецодежды "Форма №8"</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Уведомление о заказе №${order.id} отправлено администратору`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки уведомления админу:', error.message);
    return false;
  }
}

// Отправка уведомления клиенту
async function notifyUserAboutOrder(order, user) {
  if (!user?.email) {
    console.log('⚠️ Нет email у пользователя, пропускаем уведомление');
    return false;
  }
  
  console.log(`📧 Отправка уведомления клиенту ${user.email} о заказе №${order.id}...`);
  
  try {
    const info = await transporter.sendMail({
      from: 'polinatoropova1212@mail.ru',
      to: user.email,
      subject: `✅ Заказ №${order.id} принят`,
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
              <h2>✅ ЗАКАЗ ПРИНЯТ!</h2>
            </div>
            <div class="content">
              <h3>Здравствуйте, ${user.username}!</h3>
              <p>Ваш заказ <strong>№${order.id}</strong> успешно оформлен.</p>
              <p><strong>Сумма заказа:</strong> ${order.total_amount} ₽</p>
              <p><strong>Статус:</strong> ${order.status}</p>
              <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
              <hr>
              <p>Статус заказа можно отслеживать в <a href="http://localhost:3000/profile">личном кабинете</a>.</p>
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

// Создание заказа
exports.createOrder = async (req, res) => {
  console.log('📝 Создание заказа, userId:', req.userId);
  
  try {
    const { delivery_address, phone, notes } = req.body;
    
    // Получаем корзину пользователя
    const cart = await db('cart')
      .join('products', 'cart.product_id', 'products.id')
      .where('cart.user_id', req.userId)
      .select('cart.*', 'products.price as product_price', 'products.name', 'products.stock_quantity');
    
    if (cart.length === 0) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }

    console.log(`📦 Корзина содержит ${cart.length} товаров`);

    // Проверяем наличие товаров
    for (const item of cart) {
      if (item.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Товар "${item.name}" доступен в количестве ${item.stock_quantity}` 
        });
      }
    }

    // Вычисляем сумму
    const total_amount = cart.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);
    
    // Создаем заказ
    const [order] = await db('orders').insert({
      user_id: req.userId,
      total_amount,
      delivery_address,
      phone,
      notes,
      status: 'новый'
    }).returning('*');

    console.log(`✅ Заказ №${order.id} создан, сумма: ${total_amount} ₽`);

    // Добавляем позиции заказа
    for (const item of cart) {
      await db('order_items').insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.product_price
      });
      
      // Уменьшаем количество товара на складе
      await db('products').where('id', item.product_id).decrement('stock_quantity', item.quantity);
    }
    
    // Очищаем корзину
    await db('cart').where('user_id', req.userId).del();

    // Получаем данные пользователя
    const user = await db('users').where('id', req.userId).first();

    // 📧 ОТПРАВЛЯЕМ УВЕДОМЛЕНИЯ
    await notifyAdminAboutOrder(order, user);  // администратору
    await notifyUserAboutOrder(order, user);   // клиенту

    res.json({ message: 'Заказ оформлен', order });
    
  } catch (error) {
    console.error('❌ Ошибка оформления заказа:', error);
    res.status(500).json({ error: 'Ошибка оформления заказа: ' + error.message });
  }
};

// Получить заказы пользователя
exports.getUserOrders = async (req, res) => {
  console.log('📋 Запрос заказов пользователя:', req.userId);
  
  try {
    const orders = await db('orders')
      .where('user_id', req.userId)
      .orderBy('order_date', 'desc');
    
    // Добавляем позиции заказов
    for (const order of orders) {
      order.items = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', order.id)
        .select('order_items.*', 'products.name');
    }
    
    console.log(`📋 Найдено заказов: ${orders.length}`);
    res.json({ orders });
  } catch (error) {
    console.error('❌ Ошибка получения заказов:', error);
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

// Получить все заказы (админ)
exports.getAllOrders = async (req, res) => {
  console.log('📋 Запрос всех заказов (админ)');
  
  try {
    const orders = await db('orders')
      .leftJoin('users', 'orders.user_id', 'users.id')
      .select('orders.*', 'users.username', 'users.email')
      .orderBy('order_date', 'desc');
    
    // Добавляем позиции заказов
    for (const order of orders) {
      order.items = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', order.id)
        .select('order_items.*', 'products.name');
    }
    
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

// Обновить статус заказа
exports.updateStatus = async (req, res) => {
  console.log(`📝 Обновление статуса заказа ${req.params.orderId} -> ${req.body.status}`);
  
  try {
    const [order] = await db('orders')
      .where('id', req.params.orderId)
      .update({ 
        status: req.body.status, 
        updated_at: new Date() 
      })
      .returning('*');
    
    // Отправляем уведомление клиенту
    if (order && order.user_id) {
      const user = await db('users').where('id', order.user_id).first();
      if (user && user.email) {
        await transporter.sendMail({
          from: 'polinatoropova1212@mail.ru',
          to: user.email,
          subject: `📦 Статус заказа №${order.id} изменен`,
          html: `
            <h2>Статус вашего заказа №${order.id} изменен!</h2>
            <p><strong>Новый статус:</strong> ${order.status}</p>
            <p>Следите за обновлениями в <a href="http://localhost:3000/profile">личном кабинете</a>.</p>
          `
        });
        console.log(`✅ Уведомление отправлено клиенту ${user.email}`);
      }
    }
    
    res.json({ message: 'Статус обновлён', order });
  } catch (error) {
    console.error('❌ Ошибка обновления статуса:', error);
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};