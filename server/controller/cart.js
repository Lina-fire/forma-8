const db = require('../config/db');

exports.getCart = async (req, res) => {
  try {
    const cart = await db('cart')
      .join('products', 'cart.product_id', 'products.id')
      .where('cart.user_id', req.userId)
      .select(
        'cart.*',
        'products.name',
        'products.price',
        'products.image_url',
        'products.stock_quantity',
        'products.description',
        'products.size',
        'products.color',
        'products.material'
      );
    res.json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения корзины' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await db('products').where('id', product_id).first();
    
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Проверка наличия
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        error: `Доступно только ${product.stock_quantity} шт. товара "${product.name}"`,
        available: product.stock_quantity
      });
    }

    const existing = await db('cart').where({ user_id: req.userId, product_id }).first();
    
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      // Проверка с учетом уже имеющегося количества
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({ 
          error: `Нельзя добавить больше ${product.stock_quantity} шт. товара "${product.name}"`,
          available: product.stock_quantity
        });
      }
      await db('cart')
        .where({ user_id: req.userId, product_id })
        .update({ quantity: newQuantity, updated_at: new Date() });
    } else {
      await db('cart').insert({ 
        user_id: req.userId, 
        product_id, 
        quantity,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    res.json({ message: 'Товар добавлен в корзину' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка добавления в корзину' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await db('cart').where({ user_id: req.userId, product_id: req.params.product_id }).del();
    res.json({ message: 'Товар удалён из корзины' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления из корзины' });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product_id = req.params.product_id;
    
    if (quantity < 1) {
      return res.status(400).json({ error: 'Количество должно быть больше 0' });
    }
    
    // Проверяем наличие товара на складе
    const product = await db('products').where('id', product_id).first();
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        error: `Доступно только ${product.stock_quantity} шт. товара "${product.name}"`,
        available: product.stock_quantity
      });
    }
    
    await db('cart')
      .where({ user_id: req.userId, product_id })
      .update({ quantity, updated_at: new Date() });
    
    res.json({ message: 'Количество обновлено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка обновления количества' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await db('cart').where({ user_id: req.userId }).del();
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка очистки корзины' });
  }
};