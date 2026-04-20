const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Папка для загрузки изображений
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Папка uploads создана');
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Хранилище товаров в памяти (пока без БД)
let products = [];
let nextId = 1;

// Получить количество товаров
router.get('/all', (req, res) => {
  console.log('📊 Запрос количества товаров');
  res.json({ count: products.length });
});

// Получить товары с пагинацией
router.get('/lim', (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 6;
  console.log(`📦 Запрос товаров: offset=${offset}, limit=${limit}`);
  
  const paginatedProducts = products.slice(offset, offset + limit);
  res.json({ products: paginatedProducts });
});

// Добавить товар
router.post('/add', upload.single('image'), (req, res) => {
  try {
    console.log('📝 Получен запрос на добавление товара');
    console.log('Тело запроса:', req.body);
    console.log('Файл:', req.file);
    
    const { name, description, price, size, color, material } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    
    const newProduct = {
      id: nextId++,
      name: name || '',
      description: description || '',
      price: parseFloat(price) || 0,
      size: size || '',
      color: color || '',
      material: material || '',
      image: imagePath
    };
    
    products.push(newProduct);
    console.log(`✅ Товар добавлен: ${newProduct.name} (ID: ${newProduct.id})`);
    
    res.status(201).json({
      message: 'Товар успешно добавлен',
      product: newProduct
    });
  } catch (error) {
    console.error('❌ Ошибка:', error);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

// Удалить товар
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex !== -1) {
    const product = products[productIndex];
    if (product.image && product.image !== '') {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    products.splice(productIndex, 1);
    console.log(`🗑️ Товар удален: ID ${id}`);
    res.json({ message: 'Товар удален' });
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// Получить один товар
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

module.exports = router;