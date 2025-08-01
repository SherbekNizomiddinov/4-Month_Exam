const fs = require('fs');
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
let users = [];
// users.json dan ma'lumotlarni o'qish (db dan)
const dbPath = path.join(__dirname, 'db');
const usersFilePath = path.join(dbPath, 'users.json');
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
}
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, '[]');
}
if (fs.existsSync(usersFilePath)) {
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8'); // UTF-8 kodlashini aniq belgilash
        users = usersData.trim() === '' ? [] : JSON.parse(usersData); // Bo'sh bo'lsa, bo'sh massivga o'tkazish
    } catch (err) {
        console.error('users.json o\'qishda xatolik:', err);
        users = []; // Xatolik bo'lsa, bo'sh massiv bilan davom etish
    }
} else {
    fs.writeFileSync(usersFilePath, '[]');
}

// Mahsulotlar bazasi (vaqtinchalik)
const products = [
    { id: 1, name: "Telefon", price: 2000000, image: '/images/Iphone.jpg' },
    { id: 2, name: "Noutbuk", price: 3500000, image: '/images/laptop.jpg' },
    { id: 3, name: "Planshet", price: 1500000, image: '/images/tablet.jpg' },
    { id: 4, name: "Smart Watch", price: 800000, image: '/images/smartwatch.jpg' },
    { id: 5, name: "Kamera", price: 1200000, image: '/images/camera.jpg' },
    { id: 6, name: "Quloqchin", price: 500000, image: '/images/earphones.jpg' },
    { id: 7, name: "Joystik", price: 2500000, image: '/images/djoystik.jpg' },
    { id: 8, name: "Televizor", price: 4000000, image: '/images/televisor.jpg' },
    { id: 9, name: "PlayStation", price: 3000000, image: '/images/playstation.jpg' },
    { id: 10, name: "Konditsioner", price: 5000000, image: '/images/konditsioner.jpg' },
    { id: 11, name: "Printer", price: 1000000, image: '/images/printer.jpg' },
    { id: 12, name: "Router", price: 600000, image: '/images/router.jpg' },
    { id: 13, name: "USB Flash Drive", price: 200000, image: '/images/usb.jpg' },
    { id: 14, name: "Monitor", price: 1800000, image: '/images/monitor.jpg' },
    { id: 16, name: "Sichqoncha", price: 250000, image: '/images/sichqoncha.jpg' },
    { id: 17, name: "Web Kamera", price: 700000, image: '/images/webcam.jpg' }
];

// Mahsulotlar xaridi uchun JSON fayl (db dan)
const productsFilePath = path.join(dbPath, 'products.json');
if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, '[]');
}

// Emailni tekshirish funksiyasi
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu)$/i;
    return emailRegex.test(email);
}

// Bosh sahifa marshruti (ro'yhatdan o'tishga yo'naltirish)
app.get('/', (req, res) => {
    res.redirect('/register');
});

// Mahsulotlar ro'yxati (qidiruv bilan)
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
    res.render('login', { error: null, cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Login sahifasi (POST)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render('login', { error: 'Iltimos, barcha maydonlarni to\'ldiring!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    if (!isValidEmail(email)) {
        return res.render('login', { error: 'Iltimos, to\'liq va haqiqiy email kiriting (masalan, user@gmail.com)!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        req.session.user = { email };
        res.redirect('/products');
    } else {
        res.render('login', { error: 'Noto\'g\'ri email yoki parol!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
});

// Register sahifasi (GET)
app.get('/register', (req, res) => {
    res.render('register', { error: null, cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Register sahifasi (POST)
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.render('register', { error: 'Iltimos, barcha maydonlarni to\'ldiring!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    if (!isValidEmail(email)) {
        return res.render('register', { error: 'Iltimos, to\'liq va haqiqiy email kiriting (masalan, user@gmail.com)!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    if (username.length < 8) {
        return res.render('register', { error: 'Kamida 8 tadan ko\'p belgi kiriting!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    if (users.find(u => u.email === email)) {
        return res.render('register', { error: 'Bu email allaqachon ro\'yxatdan o\'tgan!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    users.push({ username, email, password });
    // db/users.json ga yozish
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log('Yangi user qo\'shildi:', { username, email, password });
    } catch (err) {
        console.error('Faylga yozishda xatolik:', err);
        return res.render('register', { error: 'Faylga yozishda xatolik yuz berdi!', cartCount: req.session.cart ? req.session.cart.length : 0 });
    }
    req.session.user = { email };
    res.redirect('/products');
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
    if (!req.session.cart) req.session.cart = [];
    if (!req.session.cart.includes(parseInt(productId))) {
        req.session.cart.push(parseInt(productId));
    }
    res.redirect('/products');
});

// Savatcha sahifasi
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
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
    // db/products.json ga yozish
    if (cart.length > 0) {
        try {
            fs.writeFileSync(productsFilePath, JSON.stringify(cartItems, null, 2));
        } catch (err) {
            console.error('Faylga yozishda xatolik:', err);
            return res.render('cart', { cartItems, total, cartCount: cart.length, error: 'Faylga yozishda xatolik yuz berdi!' });
        }
    }
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