const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const uploadDir = path.join(__dirname, '../uploads/atelier');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
exports.upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('photo');

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru', port: 465, secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.createRequest = async (req, res) => {
  try {
    const { service_type, description, contact_phone } = req.body;
    const photo_url = req.file ? `/uploads/atelier/${req.file.filename}` : null;
    const [request] = await db('atelier_requests').insert({
      user_id: req.userId, service_type, description, photo_url, contact_phone, status: 'новая'
    }).returning('*');
    
    const user = await db('users').where('id', req.userId).first();
    await transporter.sendMail({
      from: process.env.EMAIL_USER, to: 'admin@forma8.ru', subject: 'Новая заявка в ателье',
      html: `<h2>Заявка №${request.id}</h2><p>Клиент: ${user.username}</p><p>Телефон: ${contact_phone}</p><p>Услуга: ${service_type}</p><p>Описание: ${description}</p>`
    });
    res.json({ message: 'Заявка отправлена', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании заявки' });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await db('atelier_requests').where('user_id', req.userId).orderBy('request_date', 'desc');
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заявок' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await db('atelier_requests')
      .leftJoin('users', 'atelier_requests.user_id', 'users.id')
      .select('atelier_requests.*', 'users.username', 'users.email')
      .orderBy('request_date', 'desc');
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заявок' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const [request] = await db('atelier_requests')
      .where('id', req.params.requestId)
      .update({ status: req.body.status, admin_notes: req.body.admin_notes })
      .returning('*');
    if (request) {
      const user = await db('users').where('id', request.user_id).first();
      await transporter.sendMail({
        from: process.env.EMAIL_USER, to: user.email, subject: `Статус заявки №${request.id}`,
        html: `<p>Статус: ${req.body.status}</p>${req.body.admin_notes ? `<p>Комментарий: ${req.body.admin_notes}</p>` : ''}`
      });
    }
    res.json({ message: 'Статус обновлён', request });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};