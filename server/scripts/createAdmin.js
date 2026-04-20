const bcrypt = require('bcrypt');
const db = require('../config/db');

async function createAdmin() {
  try {
    // Удаляем старого администратора
    await db('users').where('role', 'admin').del();
    console.log('✅ Старые администраторы удалены');
    
    // Хешируем пароль
    const password = 'admin2025';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создаём нового администратора
    const [user] = await db('users').insert({
      username: 'Admin',
      email: 'admin@forma8.ru',
      phone: '+79001234567',
      password_hash: hashedPassword,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }).returning(['id', 'username', 'email', 'role']);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Администратор создан!');
    console.log(`   Логин: admin@forma8.ru`);
    console.log(`   Пароль: admin2025`);
    console.log(`   ID: ${user.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    process.exit();
  }
}

createAdmin();