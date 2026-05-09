const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Очищаем таблицы
  await knex('atelier_requests').del();
  await knex('order_items').del();
  await knex('orders').del();
  await knex('favorites').del();
  await knex('cart').del();
  await knex('products').del();
  await knex('categories').del();
  await knex('users').del();
  
  // 1. Хешируем пароль администратора
  const hashedPasswordAdmin = await bcrypt.hash('Polina@12121020', 10);
  
  // 2. Создаем администратора Полину
  const [adminId] = await knex('users').insert({
    username: 'Полина',
    email: 'polinatoropova1212@mail.ru',
    phone: '+79307412117',
    password_hash: hashedPasswordAdmin,
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date()
  }).returning('id');
  
  console.log('✅ Администратор создан:');
  console.log(`   ID: ${adminId.id}`);
  console.log(`   Имя: Полина`);
  console.log(`   Email: polinatoropova1212@mail.ru`);
  console.log(`   Пароль: Polina@12121020`);
  
  // 3. Создаем тестового пользователя
  const hashedPasswordUser = await bcrypt.hash('user123', 10);
  
  const [userId] = await knex('users').insert({
    username: 'Тестовый пользователь',
    email: 'test@example.com',
    phone: '+79009999999',
    password_hash: hashedPasswordUser,
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  }).returning('id');
  
  console.log(`\n✅ Тестовый пользователь создан: ID ${userId.id}`);
  
  // 4. Добавляем категории
  await knex('categories').insert([
    { id: 1, name: 'Летняя спецодежда', description: 'Одежда для работы в теплое время года' },
    { id: 2, name: 'Зимняя спецодежда', description: 'Утепленная одежда для работы в холод' },
    { id: 3, name: 'Спецодежда для туризма', description: 'Одежда для активного отдыха' },
    { id: 4, name: 'Сигнальная одежда', description: 'Яркая одежда со светоотражающими элементами' },
    { id: 5, name: 'Средства защиты', description: 'Каски, перчатки, обувь' }
  ]);
  
  console.log('\n✅ Категории добавлены');
  
  // 5. Выводим список всех пользователей
  const users = await knex('users').select('id', 'username', 'email', 'role');
  console.log('\n📋 Все пользователи:');
  console.table(users);
};