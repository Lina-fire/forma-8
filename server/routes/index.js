const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const auth = require('../controller/auth');
const products = require('../controller/products');
const cart = require('../controller/cart');
const favorites = require('../controller/favorites');
const orders = require('../controller/orders');
const atelier = require('../controller/atelier');

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// Products
router.get('/products/all', products.getAll);
router.get('/products/lim', products.getPaginated);
router.get('/products/:id', products.getOne);
router.post('/products/add', verifyToken, isAdmin, products.upload, products.create);
router.put('/products/:id', verifyToken, isAdmin, products.update);
router.delete('/products/:id', verifyToken, isAdmin, products.delete);

// Cart
router.get('/cart', verifyToken, cart.getCart);
router.post('/cart/add', verifyToken, cart.addToCart);
router.delete('/cart/remove/:product_id', verifyToken, cart.removeFromCart);

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

module.exports = router;