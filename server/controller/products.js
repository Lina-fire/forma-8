const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
exports.upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

exports.getAll = async (req, res) => {
  const products = await db('products').orderBy('id');
  res.json({ count: products.length, products });
};

exports.getPaginated = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 6;
  const products = await db('products').offset(offset).limit(limit).orderBy('id');
  res.json({ products });
};

exports.getOne = async (req, res) => {
  const product = await db('products').where('id', req.params.id).first();
  product ? res.json(product) : res.status(404).json({ error: 'Товар не найден' });
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, size, color, material, stock_quantity, category_id } = req.body;
    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;
    const [product] = await db('products').insert({
      name, description, price, size, color, material, stock_quantity, category_id, image_url
    }).returning('*');
    res.status(201).json({ message: 'Товар добавлен', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка добавления товара' });
  }
};

exports.update = async (req, res) => {
  const [product] = await db('products').where('id', req.params.id).update(req.body).returning('*');
  product ? res.json({ message: 'Товар обновлён', product }) : res.status(404).json({ error: 'Товар не найден' });
};

exports.delete = async (req, res) => {
  const deleted = await db('products').where('id', req.params.id).del();
  deleted ? res.json({ message: 'Товар удалён' }) : res.status(404).json({ error: 'Товар не найден' });
};