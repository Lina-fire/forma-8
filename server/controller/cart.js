const db = require('../config/db');

exports.getCart = async (req, res) => {
  try {
    const cart = await db('cart')
      .join('products', 'cart.product_id', 'products.id')
      .where('cart.user_id', req.userId)
      .select('cart.*', 'products.name', 'products.price', 'products.image_url', 'products.stock_quantity');
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
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: `Доступно только ${product.stock_quantity} шт.` });
    }

    const existing = await db('cart').where({ user_id: req.userId, product_id }).first();
    if (existing) {
      await db('cart').where({ user_id: req.userId, product_id }).update({ quantity: existing.quantity + quantity });
    } else {
      await db('cart').insert({ user_id: req.userId, product_id, quantity });
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