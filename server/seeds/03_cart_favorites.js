exports.seed = async function(knex) {
  // Добавляем примеры корзины и избранного
  await knex('cart').del();
  await knex('favorites').del();
  
  // Получаем ID пользователя и товаров
  const user = await knex('users').where('email', 'ivan@example.com').first();
  const products = await knex('products').select('id').limit(3);
  
  if (user && products.length) {
    // Добавляем товары в корзину
    await knex('cart').insert([
      { user_id: user.id, product_id: products[0].id, quantity: 2 },
      { user_id: user.id, product_id: products[1].id, quantity: 1 }
    ]);
    
    // Добавляем товары в избранное
    await knex('favorites').insert([
      { user_id: user.id, product_id: products[2].id }
    ]);
    
    console.log('✅ Примеры корзины и избранного добавлены');
  }
};