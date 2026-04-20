const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru', port: 465, secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.createOrder = async (req, res) => {
  try {
    const { delivery_address, phone, notes } = req.body;
    const cart = await db('cart')
      .join('products', 'cart.product_id', 'products.id')
      .where('cart.user_id', req.userId)
      .select('cart.*', 'products.price as product_price', 'products.name');
    
    if (cart.length === 0) return res.status(400).json({ error: 'Корзина пуста' });

    for (const item of cart) {
      const product = await db('products').where('id', item.product_id).first();
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Товар "${product.name}" доступен в количестве ${product.stock_quantity}` });
      }
    }

    const total_amount = cart.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    const [order] = await db('orders').insert({
      user_id: req.userId, total_amount, delivery_address, phone, notes, status: 'новый'
    }).returning('*');

    for (const item of cart) {
      await db('order_items').insert({
        order_id: order.id, product_id: item.product_id, quantity: item.quantity, price_at_time: item.product_price
      });
      await db('products').where('id', item.product_id).decrement('stock_quantity', item.quantity);
    }
    await db('cart').where('user_id', req.userId).del();

    const user = await db('users').where('id', req.userId).first();
    await transporter.sendMail({
      from: process.env.EMAIL_USER, to: user.email, subject: 'Заказ принят',
      html: `<h2>Заказ №${order.id} принят!</h2><p>Сумма: ${total_amount} ₽</p>`
    });
    res.json({ message: 'Заказ оформлен', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка оформления заказа' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await db('orders').where('user_id', req.userId).orderBy('order_date', 'desc');
    for (const order of orders) {
      order.items = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', order.id)
        .select('order_items.*', 'products.name');
    }
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await db('orders')
      .leftJoin('users', 'orders.user_id', 'users.id')
      .select('orders.*', 'users.username', 'users.email')
      .orderBy('order_date', 'desc');
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const [order] = await db('orders').where('id', req.params.orderId).update({ status: req.body.status }).returning('*');
    if (order) {
      const user = await db('users').where('id', order.user_id).first();
      await transporter.sendMail({
        from: process.env.EMAIL_USER, to: user.email, subject: `Статус заказа №${order.id}`,
        html: `<p>Статус изменён на: ${req.body.status}</p>`
      });
    }
    res.json({ message: 'Статус обновлён', order });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};