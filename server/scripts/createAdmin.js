const bcrypt = require('bcrypt');
const knex = require('knex');
const path = require('path');

// Подключаемся к базе данных
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'Polina@12121020',
    database: 'forma8_db'
  }
});

async function createAdmin() {
  try {
    console.log('🔍 Проверка подключения к базе данных...');
    
    // Проверяем подключение
    await db.raw('SELECT 1');
    console.log('✅ Подключение к БД успешно');

    // Проверяем, существует ли уже администратор
    const existingAdmin = await db('users')
      .where('email', 'polinatoropova1212@mail.ru')
      .orWhere('role', 'admin')
      .first();

    if (existingAdmin) {
      console.log('⚠️ Администратор уже существует:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Имя: ${existingAdmin.username}`);
      console.log(`   Роль: ${existingAdmin.role}`);
      
      // Спрашиваем, нужно ли обновить пароль
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        readline.question('Хотите обновить пароль администратора? (y/n): ', resolve);
      });
      readline.close();
      
      if (answer.toLowerCase() === 'y') {
        const hashedPassword = await bcrypt.hash('Polina@12121020', 10);
        await db('users')
          .where('email', 'polinatoropova1212@mail.ru')
          .update({
            password_hash: hashedPassword,
            updated_at: new Date()
          });
        console.log('✅ Пароль администратора обновлен!');
      } else {
        console.log('❌ Операция отменена');
      }
      await db.destroy();
      return;
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('Polina@12121020', 10);
    
    // Создаем нового администратора
    const [user] = await db('users').insert({
      username: 'Admin',
      email: 'polinatoropova1212@mail.ru',
      phone: '+79307412117',
      password_hash: hashedPassword,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }).returning (['id', 'username', 'email', 'role']);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Администратор успешно создан!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ID: ${user.id}`);
    console.log(`   Имя: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Роль: ${user.role}`);
    console.log(`   Пароль: Polina@12121020`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Теперь вы можете войти в систему как администратор');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Проверьте настройки подключения к БД в файле scripts/createAdmin.js:');
      console.log('   - host: 127.0.0.1');
      console.log('   - port: 5432');
      console.log('   - user: postgres');
      console.log('   - password: Polina@12121020');
      console.log('   - database: forma8_db');
    }
  } finally {
    await db.destroy();
  }
}

createAdmin();