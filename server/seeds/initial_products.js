/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('products').del();
  
  // Inserts seed entries
  await knex('products').insert([
    {
      name: 'Костюм "КАРАТ"',
      description: 'Летний костюм для защиты от общих производственных загрязнений',
      price: 1300,
      size: '48-50',
      color: 'синий',
      material: 'смесовая ткань (65% полиэстер, 35% хлопок)',
      image_url: '/images/karat.jpg',
      stock_quantity: 15
    },
    {
      name: 'Брюки рабочие',
      description: 'Усиленные брюки с накладными карманами',
      price: 500,
      size: '52-54',
      color: 'серый',
      material: 'рипстоп',
      image_url: '/images/pants.jpg',
      stock_quantity: 23
    },
    {
      name: 'Зимний костюм "Арктика"',
      description: 'Утепленный костюм для работ при низких температурах',
      price: 2500,
      size: '56',
      color: 'хаки',
      material: 'плащевка с утеплителем',
      image_url: '/images/arctika.jpg',
      stock_quantity: 8
    },
    {
      name: 'Куртка утепленная',
      description: 'Утепленная куртка на флисе',
      price: 1800,
      size: '50-52',
      color: 'черный',
      material: 'оксфорд 600D',
      image_url: '/images/jacket.jpg',
      stock_quantity: 12
    },
    {
      name: 'Рукавицы рабочие',
      description: 'Рукавицы с усилением наладонника',
      price: 150,
      size: 'универсальный',
      color: 'бежевый',
      material: 'хлопок с ПВХ',
      image_url: '/images/gloves.jpg',
      stock_quantity: 45
    },
    {
      name: 'Жилет сигнальный',
      description: 'Сигнальный жилет 2 класса защиты',
      price: 320,
      size: '48-50',
      color: 'оранжевый',
      material: 'сетка ПВХ',
      image_url: '/images/vest.jpg',
      stock_quantity: 30
    },
    {
      name: 'Футболка поло',
      description: 'Футболка поло с логотипом',
      price: 450,
      size: '50-52',
      color: 'темно-синий',
      material: '100% хлопок',
      image_url: '/images/polo.jpg',
      stock_quantity: 50
    },
    {
      name: 'Кепка рабочая',
      description: 'Кепка с козырьком для защиты от солнца',
      price: 250,
      size: 'универсальный',
      color: 'хаки',
      material: 'хлопок',
      image_url: '/images/cap.jpg',
      stock_quantity: 40
    },
    {
      name: 'Сапоги резиновые',
      description: 'Резиновые сапоги с утеплителем',
      price: 890,
      size: '42',
      color: 'черный',
      material: 'ПВХ',
      image_url: '/images/boots.jpg',
      stock_quantity: 18
    },
    {
      name: 'Перчатки тактильные',
      description: 'Тонкие перчатки для точных работ',
      price: 90,
      size: 'L',
      color: 'серый',
      material: 'нейлон с нитрилом',
      image_url: '/images/gloves_thin.jpg',
      stock_quantity: 100
    },
    {
      name: 'Комбинезон рабочий',
      description: 'Полукомбинезон для сварщиков',
      price: 2200,
      size: '54',
      color: 'синий',
      material: 'брезент',
      image_url: '/images/overalls.jpg',
      stock_quantity: 5
    },
    {
      name: 'Шапка зимняя',
      description: 'Утепленная шапка под каску',
      price: 380,
      size: 'универсальный',
      color: 'черный',
      material: 'акрил',
      image_url: '/images/hat.jpg',
      stock_quantity: 35
    }
  ]);
};