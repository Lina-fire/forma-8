// В начале atelier.js добавьте:
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка загрузки файлов для ателье
const uploadDir = path.join(__dirname, '../uploads/atelier');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

exports.upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('photo');