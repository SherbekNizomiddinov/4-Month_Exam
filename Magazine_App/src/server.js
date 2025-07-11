require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Sessiya sozlamalari
app.use(session({
    secret: process.env.SESSION_SECRET || 'maxfiysoz',
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Foydalanuvchilar ro'yxati (vaqtinchalik xotirada)
let users = []; // Haqiqiy loyiha uchun bazaga o'tishingiz kerak

const products = [
    { id: 1, name: "Telefon", price: 2000000, image: '/images/Iphone.jpg' },
    { id: 2, name: "Noutbuk", price: 3500000, image: '/images/laptop.jpg' },
    { id: 3, name: "Planshet", price: 1500000, image: '/images/tablet.jpg' },
    { id: 4, name: "Smart Watch", price: 800000, image: '/images/smartwatch.jpg' },
    { id: 5, name: "Kamera", price: 1200000, image: '/images/camera.jpg' },
    { id: 6, name: "Quloqchin", price: 500000, image: '/images/earphones.jpg' },
    {id: 7, name: "Joystik", price: 2500000, image: '/images/djoystik.jpg' },
    {id: 8, name: "Televizor", price: 4000000, image: '/images/televisor.jpg' },
    {id: 9, name: "PlayStation", price: 3000000, image: '/images/playstation.jpg' },
    {id: 10, name: "Konditsioner", price: 5000000, image: '/images/konditsioner.jpg' },
    {id: 11, name: "Printer", price: 1000000, image: '/images/printer.jpg' },
    {id: 12, name: "Router", price: 600000, image: '/images/router.jpg' },
    {id: 13, name: "USB Flash Drive", price: 200000, image: '/images/usb.jpg' },
    {id: 14, name: "Monitor", price: 1800000, image: '/images/monitor.jpg' },
    {id: 16, name: "Sichqoncha", price: 250000, image: '/images/sichqoncha.jpg' },
    {id: 17, name: "Web Kamera", price: 700000, image: '/images/webcam.jpg' },
];

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.get('/products', (req, res) => {
    const searchQuery = req.query.search || '';
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    res.render('index', { 
        products: filteredProducts, 
        cartCount: req.session.cart ? req.session.cart.reduce((sum, id) => sum + (products.find(p => p.id === id) ? 1 : 0), 0) : 0 
    });
});

// Login sahifasi (GET)
app.get('/login', (req, res) => {
    res.render('login', { cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Login sahifasi (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = { username };
        res.redirect('/products');
    } else {
        res.send('Noto\'g\'ri login yoki parol!');
    }
});

// Register sahifasi (GET)
app.get('/register', (req, res) => {
    res.render('register', { cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Register sahifasi (POST)
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        users.push({ username, password });
        req.session.user = { username };
        res.redirect('/products');
    } else {
        res.send('Iltimos, barcha maydonlarni to\'ldiring!');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/register');
    });
});

// Savatchaga qo‘shish
app.post('/products/add-to-cart', (req, res) => {
    let productId = req.body.productId;
    console.log('Qo‘shilayotgan productId:', productId);
    if (!req.session.cart) req.session.cart = [];
    if (!req.session.cart.includes(parseInt(productId))) {
        req.session.cart.push(parseInt(productId));
    }
    res.redirect('/products');
});

// Savatcha sahifasi
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    console.log('Savatcha ichidagi ma\'lumotlar:', cart);
    const cartItems = [];
    cart.forEach(id => {
        const existingItem = cartItems.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const product = products.find(p => p.id === id);
            if (product) {
                cartItems.push({ ...product, quantity: 1 });
            }
        }
    });
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('cart', { cartItems, total, cartCount: cart.length });
});

// Mahsulotni savatchadan o‘chirish
app.post('/cart/delete', (req, res) => {
    const productId = req.body.productId;
    if (req.session.cart) {
        const index = req.session.cart.indexOf(parseInt(productId));
        if (index !== -1) {
            req.session.cart.splice(index, 1);
        }
    }
    res.redirect('/cart');
});

// Mahsulotni qo‘shish
app.post('/cart/add-more', (req, res) => {
    const productId = req.body.productId;
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push(parseInt(productId));
    res.redirect('/cart');
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});