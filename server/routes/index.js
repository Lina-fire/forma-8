const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const auth = require('../controller/auth');
const products = require('../controller/products');
const cart = require('../controller/cart');
const favorites = require('../controller/favorites');
const orders = require('../controller/orders');
const atelier = require('../controller/atelier');
const users = require('../controller/users');
const categories = require('../controller/categories');  // ← добавьте эту строку, если её нет

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// Categories (добавьте, если нет)
router.get('/categories/all', categories.getAll);

// Products
router.get('/products/all', products.getAll);
router.get('/products/lim', products.getPaginated);
router.get('/products/:id', products.getOne);
router.post('/products/add', verifyToken, isAdmin, products.upload, products.create);
router.put('/products/:id', verifyToken, isAdmin, products.upload, products.update);
router.delete('/products/:id', verifyToken, isAdmin, products.delete);

// Cart
router.get('/cart', verifyToken, cart.getCart);
router.post('/cart/add', verifyToken, cart.addToCart);
router.put('/cart/update/:product_id', verifyToken, cart.updateQuantity);
router.delete('/cart/remove/:product_id', verifyToken, cart.removeFromCart);
router.delete('/cart/clear', verifyToken, cart.clearCart);

// Favorites
router.get('/favorites', verifyToken, favorites.getFavorites);
router.post('/favorites/add', verifyToken, favorites.addToFavorites);
router.delete('/favorites/remove/:product_id', verifyToken, favorites.removeFromFavorites);

// Orders
router.post('/orders/create', verifyToken, orders.createOrder);
router.get('/orders/user', verifyToken, orders.getUserOrders);
router.get('/orders/all', verifyToken, isAdmin, orders.getAllOrders);
router.put('/orders/:orderId/status', verifyToken, isAdmin, orders.updateStatus);

// Atelier
router.post('/atelier/create', verifyToken, atelier.upload, atelier.createRequest);
router.get('/atelier/user', verifyToken, atelier.getUserRequests);
router.get('/atelier/all', verifyToken, isAdmin, atelier.getAllRequests);
router.put('/atelier/:requestId/status', verifyToken, isAdmin, atelier.updateStatus);

// Users
router.get('/users/all', verifyToken, isAdmin, users.getAllUsers);
router.get('/users/:id', verifyToken, isAdmin, users.getUserById);
router.put('/users/:id', verifyToken, isAdmin, users.updateUser);
router.delete('/users/:id', verifyToken, isAdmin, users.deleteUser);

module.exports = router;