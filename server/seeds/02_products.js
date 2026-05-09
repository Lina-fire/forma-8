exports.seed = async function(knex) {
  await knex('products').del();
  await knex('products').insert([
    {
      id: 1,
      category_id: 1,
      name: 'Костюм рабочий летний',
      description: 'Легкий костюм для работы в жаркую погоду. Дышащая ткань, усиленные швы.',
      price: 2500.00,
      size: '48-50',
      color: 'серый',
      material: 'смесовая ткань',
      stock_quantity: 15,
      image_url: null
    },
    {
      id: 2,
      category_id: 1,
      name: 'Брюки рабочие',
      description: 'Удобные брюки с усиленными наколенниками',
      price: 1200.00,
      size: '52',
      color: 'темно-синий',
      material: 'рип-стоп',
      stock_quantity: 23,
      image_url: null
    },
    {
      id: 3,
      category_id: 2,
      name: 'Куртка зимняя утепленная',
      description: 'Теплая куртка на синтепоне. Защита от ветра и холода до -25°C.',
      price: 4500.00,
      size: '54',
      color: 'черный',
      material: 'полиэстер',
      stock_quantity: 8,
      image_url: null
    },
    {
      id: 4,
      category_id: 2,
      name: 'Комбинезон зимний',
      description: 'Утепленный комбинезон для наружных работ',
      price: 6500.00,
      size: '50',
      color: 'серый',
      material: 'смесовая ткань',
      stock_quantity: 5,
      image_url: null
    },
    {
      id: 5,
      category_id: 3,
      name: 'Костюм туристический',
      description: 'Ветрозащитный костюм для отдыха',
      price: 3800.00,
      size: '48',
      color: 'зеленый',
      material: 'полиэстер',
      stock_quantity: 12,
      image_url: null
    },
    {
      id: 6,
      category_id: 4,
      name: 'Жилет сигнальный',
      description: 'Яркий жилет со светоотражающими полосами. 2 класс защиты.',
      price: 800.00,
      size: '56',
      color: 'оранжевый',
      material: 'сетка',
      stock_quantity: 30,
      image_url: null
    },
    {
      id: 7,
      category_id: 5,
      name: 'Перчатки рабочие',
      description: 'Перчатки с ПВХ покрытием. Защита от механических повреждений.',
      price: 250.00,
      size: '10',
      color: 'серый',
      material: 'хлопок с ПВХ',
      stock_quantity: 100,
      image_url: null
    }
  ]);
  console.log('✅ Товары добавлены');
};