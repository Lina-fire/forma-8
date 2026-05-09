const db = require('../config/db');

// Получить всех пользователей (только для админа)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'username', 'email', 'phone', 'role', 'created_at', 'updated_at')
      .orderBy('id');
    
    res.json({ 
      users,
      count: users.length,
      message: 'Список всех пользователей'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
};

// Получить пользователя по ID
exports.getUserById = async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'username', 'email', 'phone', 'role', 'created_at')
      .where('id', req.params.id)
      .first();
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения пользователя' });
  }
};

// Обновить пользователя (только для админа)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, phone, role } = req.body;
    const userId = req.params.id;
    
    const existing = await db('users').where('id', userId).first();
    if (!existing) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    await db('users')
      .where('id', userId)
      .update({
        username: username || existing.username,
        email: email || existing.email,
        phone: phone || existing.phone,
        role: role || existing.role,
        updated_at: new Date()
      });
    
    const updated = await db('users')
      .select('id', 'username', 'email', 'phone', 'role')
      .where('id', userId)
      .first();
    
    res.json({ message: 'Пользователь обновлен', user: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка обновления пользователя' });
  }
};

// Удалить пользователя (только для админа)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Нельзя удалить самого себя
    if (parseInt(userId) === req.userId) {
      return res.status(400).json({ error: 'Нельзя удалить свою учетную запись' });
    }
    
    const deleted = await db('users').where('id', userId).del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ message: 'Пользователь удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
};