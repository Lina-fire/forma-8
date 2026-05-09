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
  try {
    const products = await db('products').orderBy('id');
    res.json({ count: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
};

exports.getPaginated = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const products = await db('products').offset(offset).limit(limit).orderBy('id');
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await db('products').where('id', req.params.id).first();
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения товара' });
  }
};

exports.create = async (req, res) => {
  try {
    const { 
      name, description, price, size, color, material, 
      stock_quantity, category_id 
    } = req.body;
    
    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;
    
    // Валидация и преобразование типов
    const parsedPrice = parseFloat(price);
    const parsedStock = stock_quantity === '' || stock_quantity === undefined || stock_quantity === null 
      ? 0 
      : parseInt(stock_quantity, 10);
    const parsedCategoryId = category_id === '' || category_id === undefined || category_id === null 
      ? null 
      : parseInt(category_id, 10);
    
    const [product] = await db('products').insert({
      name: name || '',
      description: description || '',
      price: isNaN(parsedPrice) ? 0 : Math.round(parsedPrice * 100) / 100,
      size: size || '',
      color: color || '',
      material: material || '',
      stock_quantity: isNaN(parsedStock) ? 0 : parsedStock,
      category_id: parsedCategoryId,
      image_url
    }).returning('*');
    
    res.status(201).json({ message: 'Товар добавлен', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка добавления товара: ' + error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      name, description, price, size, color, material, 
      stock_quantity, category_id 
    } = req.body;
    
    // Сначала получаем текущий товар
    const existingProduct = await db('products').where('id', id).first();
    if (!existingProduct) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Преобразование типов (защита от пустых строк)
    const parsedPrice = parseFloat(price);
    const parsedStock = stock_quantity === '' || stock_quantity === undefined || stock_quantity === null 
      ? existingProduct.stock_quantity 
      : parseInt(stock_quantity, 10);
    const parsedCategoryId = category_id === '' || category_id === undefined || category_id === null 
      ? existingProduct.category_id 
      : parseInt(category_id, 10);
    
    // Подготовка данных для обновления
    const updateData = {
      name: name || existingProduct.name,
      description: description !== undefined ? description : existingProduct.description,
      price: isNaN(parsedPrice) ? existingProduct.price : Math.round(parsedPrice * 100) / 100,
      size: size !== undefined ? size : existingProduct.size,
      color: color !== undefined ? color : existingProduct.color,
      material: material !== undefined ? material : existingProduct.material,
      stock_quantity: isNaN(parsedStock) ? existingProduct.stock_quantity : parsedStock,
      category_id: parsedCategoryId,
      updated_at: new Date()
    };
    
    // Если загружено новое изображение
    if (req.file) {
      updateData.image_url = `/uploads/products/${req.file.filename}`;
      
      // Удаляем старое изображение, если оно есть
      if (existingProduct.image_url && existingProduct.image_url !== '/images/placeholder.png') {
        const oldImagePath = path.join(__dirname, '..', existingProduct.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    const [product] = await db('products')
      .where('id', id)
      .update(updateData)
      .returning('*');
    
    res.json({ message: 'Товар обновлён', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка обновления товара: ' + error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Сначала получаем товар, чтобы удалить его изображение
    const product = await db('products').where('id', id).first();
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Удаляем изображение, если оно есть
    if (product.image_url && product.image_url !== '/images/placeholder.png') {
      const imagePath = path.join(__dirname, '..', product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Удаляем товар из БД
    const deleted = await db('products').where('id', id).del();
    
    if (deleted) {
      res.json({ message: 'Товар удалён' });
    } else {
      res.status(404).json({ error: 'Товар не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления товара: ' + error.message });
  }
};