const knex = require('knex');
const config = require('./config/knexfile');

const db = knex(config.development);

async function resetDatabase() {
  try {
    console.log('🗑️  Начинаем очистку базы данных...');
    
    // Отключить проверки внешних ключей
    await db.raw('SET session_replication_role = replica');
    
    // Удалить таблицы в правильном порядке
    console.log('  Удаление таблиц...');
    await db.raw('DROP TABLE IF EXISTS atelier_requests CASCADE');
    await db.raw('DROP TABLE IF EXISTS order_items CASCADE');
    await db.raw('DROP TABLE IF EXISTS orders CASCADE');
    await db.raw('DROP TABLE IF EXISTS favorites CASCADE');
    await db.raw('DROP TABLE IF EXISTS cart CASCADE');
    await db.raw('DROP TABLE IF EXISTS products CASCADE');
    await db.raw('DROP TABLE IF EXISTS categories CASCADE');
    await db.raw('DROP TABLE IF EXISTS users CASCADE');
    
    // Включить проверки обратно
    await db.raw('SET session_replication_role = DEFAULT');
    
    console.log('✅ Все таблицы успешно удалены!');
    
    // Удалить ENUM типы
    console.log('🗑️  Удаление ENUM типов...');
    await db.raw('DROP TYPE IF EXISTS user_role CASCADE');
    await db.raw('DROP TYPE IF EXISTS order_status CASCADE');
    await db.raw('DROP TYPE IF EXISTS request_status CASCADE');
    
    console.log('✅ Все ENUM типы успешно удалены!');
    console.log('🎉 База данных полностью очищена!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await db.destroy();
  }
}

resetDatabase();