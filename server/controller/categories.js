const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const categories = await db('categories').select('*').orderBy('id');
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
};