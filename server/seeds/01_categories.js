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
  // НЕ удаляем users! Пусть остаются пустыми
  
  // Добавляем только категории (без пользователей и товаров)
  await knex('categories').insert([
    { id: 1, name: 'Летняя спецодежда', description: 'Одежда для работы в теплое время года' },
    { id: 2, name: 'Зимняя спецодежда', description: 'Утепленная одежда для работы в холод' },
    { id: 3, name: 'Спецодежда для туризма', description: 'Одежда для активного отдыха' },
    { id: 4, name: 'Сигнальная одежда', description: 'Яркая одежда со светоотражающими элементами' },
    { id: 5, name: 'Средства защиты', description: 'Каски, перчатки, обувь' }
  ]);
  
  console.log('✅ Категории добавлены');
  console.log('⚠️ Пользователи и товары не создавались! Добавьте их через админ-панель.');
};