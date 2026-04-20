const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

exports.register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    
    console.log('Регистрация:', { username, email, phone });

    const existing = await db('users')
      .where('email', email)
      .orWhere('username', username)
      .first();
      
    if (existing) {
      return res.status(400).json({ error: 'Пользователь с таким email или именем уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [user] = await db('users')
      .insert({
        username,
        email,
        phone: phone || null,
        password_hash: hashedPassword,
        role: 'user'
      })
      .returning(['id', 'username', 'email', 'phone', 'role']);

    console.log('Пользователь создан:', user);

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      config.secret, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accessToken: token 
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Попытка входа:', { username });

    const user = await db('users')
      .where('email', username)
      .orWhere('username', username)
      .first();

    if (!user) {
      console.log('Пользователь не найден');
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    console.log('Пользователь найден:', { id: user.id, email: user.email, role: user.role });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('Неверный пароль');
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    console.log('Пароль верный, создаём токен');

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.secret,
      { expiresIn: '24h' }
    );

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
  }
};