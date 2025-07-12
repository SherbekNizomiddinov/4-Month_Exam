const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, '../db/products.json');

router.post('/add-to-cart', (req, res) => {
    const productId = parseInt(req.body.productId);
    console.log('Qo\'shilayotgan productId:', productId); // Debug
    if (!req.session.cart) req.session.cart = {};
    if (!req.session.cart[productId]) req.session.cart[productId] = 0;
    req.session.cart[productId]++;
    console.log('Yangilangan cart:', req.session.cart); // Debug
    res.redirect('/products');
});

router.get('/cart', async (req, res) => {
    const cart = req.session.cart || {};
    console.log('Cart session:', cart); // Debug
    const products = JSON.parse(await fs.readFile(productsFile, 'utf-8'));
    const cartItems = Object.entries(cart).map(([id, quantity]) => {
        const product = products.find(p => p.id === parseInt(id));
        return product ? { ...product, quantity } : null;
    }).filter(item => item !== null);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('cart', { cartItems, total, cartCount: Object.keys(cart).length });
});

router.post('/delete', (req, res) => {
    const productId = parseInt(req.body.productId);
    if (req.session.cart && req.session.cart[productId]) {
        delete req.session.cart[productId];
        if (Object.keys(req.session.cart).length === 0) delete req.session.cart;
    }
    res.redirect('/cart');
});

router.post('/add-more', (req, res) => {
    const productId = parseInt(req.body.productId);
    if (!req.session.cart) req.session.cart = {};
    if (!req.session.cart[productId]) req.session.cart[productId] = 0;
    req.session.cart[productId]++;
    res.redirect('/cart');
});

module.exports = router;