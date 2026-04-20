const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Очищаем таблицы в правильном порядке
  await knex('atelier_requests').del();
  await knex('order_items').del();
  await knex('orders').del();
  await knex('favorites').del();
  await knex('cart').del();
  await knex('products').del();
  await knex('categories').del();
  await knex('users').del();
  
  // Хешируем пароль администратора
  const hashedPassword = await bcrypt.hash('admin2025', 10);
  
  // Добавляем пользователя-администратора
  const [adminId] = await knex('users').insert({
    username: 'Admin',
    email: 'admin@forma8.ru',
    phone: '+79001234567',
    password_hash: hashedPassword,
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date()
  }).returning('id');
  
  console.log('✅ Администратор создан с ID:', adminId.id);
  
  // Добавляем категории
  await knex('categories').insert([
    { id: 1, name: 'Летняя спецодежда', description: 'Одежда для работы в теплое время года' },
    { id: 2, name: 'Зимняя спецодежда', description: 'Утепленная одежда для работы в холод' },
    { id: 3, name: 'Спецодежда для туризма', description: 'Одежда для активного отдыха' },
    { id: 4, name: 'Сигнальная одежда', description: 'Яркая одежда со светоотражающими элементами' },
    { id: 5, name: 'Средства защиты', description: 'Каски, перчатки, обувь' }
  ]);
};