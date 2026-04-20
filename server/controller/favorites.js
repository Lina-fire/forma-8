const db = require('../config/db');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await db('favorites')
      .join('products', 'favorites.product_id', 'products.id')
      .where('favorites.user_id', req.userId)
      .select('favorites.*', 'products.name', 'products.price', 'products.image_url');
    res.json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения избранного' });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const { product_id } = req.body;
    const existing = await db('favorites').where({ user_id: req.userId, product_id }).first();
    if (!existing) {
      await db('favorites').insert({ user_id: req.userId, product_id });
    }
    res.json({ message: 'Добавлено в избранное' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка добавления в избранное' });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    await db('favorites').where({ user_id: req.userId, product_id: req.params.product_id }).del();
    res.json({ message: 'Удалено из избранного' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления из избранного' });
  }
};