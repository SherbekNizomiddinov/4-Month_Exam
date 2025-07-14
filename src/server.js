const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")

const app = express()
const PORT = 3000

// Sozlamalar
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))
app.set("view engine", "ejs")

// Session sozlamalari
app.use(
  session({
    secret: "online-magazin-secret",
    resave: false,
    saveUninitialized: true,
  }),
)

// Mahsulotlar ma'lumotlari
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 1200, // 12,000,000 so'm o'rniga 1200$
    category: "telefon",
    image: "/placeholder.svg?height=300&width=300",
    description: "Eng yangi iPhone modeli. A17 Pro chip, titanium korpus.",
    inStock: true,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 1050, // 10,500,000 so'm o'rniga 1050$
    category: "telefon",
    image: "/placeholder.svg?height=300&width=300",
    description: "Samsung'ning eng yangi flagman telefoni.",
    inStock: true,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 3,
    name: "MacBook Air M3",
    price: 1500, // 15,000,000 so'm o'rniga 1500$
    category: "laptop",
    image: "/placeholder.svg?height=300&width=300",
    description: "Apple M3 chip bilan yangi MacBook Air.",
    inStock: true,
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 4,
    name: "Dell XPS 13",
    price: 1250, // 12,500,000 so'm o'rniga 1250$
    category: "laptop",
    image: "/placeholder.svg?height=300&width=300",
    description: "Yuqori sifatli ultrabook laptop.",
    inStock: false,
    rating: 4.6,
    reviews: 67,
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: 450, // 4,500,000 so'm o'rniga 450$
    category: "audio",
    image: "/placeholder.svg?height=300&width=300",
    description: "Eng yaxshi noise-canceling naushniklar.",
    inStock: true,
    rating: 4.8,
    reviews: 445,
  },
  {
    id: 6,
    name: "AirPods Pro 2",
    price: 320, // 3,200,000 so'm o'rniga 320$
    category: "audio",
    image: "/placeholder.svg?height=300&width=300",
    description: "Apple'ning simsiz naushnik modeli.",
    inStock: true,
    rating: 4.7,
    reviews: 678,
  },
  {
    id: 7,
    name: "iPad Pro 12.9",
    price: 1350, // 13,500,000 so'm o'rniga 1350$
    category: "planshet",
    image: "/placeholder.svg?height=300&width=300",
    description: "Professional ishlar uchun iPad.",
    inStock: true,
    rating: 4.8,
    reviews: 123,
  },
  {
    id: 8,
    name: "Samsung Tab S9",
    price: 850, // 8,500,000 so'm o'rniga 850$
    category: "planshet",
    image: "/placeholder.svg?height=300&width=300",
    description: "Android planshet flagman modeli.",
    inStock: true,
    rating: 4.5,
    reviews: 89,
  },
]

// Kategoriyalar
const categories = [
  { id: "telefon", name: "Telefonlar", icon: "📱" },
  { id: "laptop", name: "Laptoplar", icon: "💻" },
  { id: "audio", name: "Audio", icon: "🎧" },
  { id: "planshet", name: "Planshetlar", icon: "📱" },
]

// Foydalanuvchilar ro'yxati (vaqtinchalik xotirada)
// Blog postlari (vaqtinchalik xotirada)
// Blog postlari (vaqtinchalik xotirada)
let posts = [
  {
    id: 1,
    title: "Node.js bilan boshlash",
    author: "Ali Valiyev",
    date: "2024-07-10",
    content:
      "Node.js - bu JavaScript runtime muhiti bo'lib, server tomonida ilovalar yaratish uchun ishlatiladi. Uning yordamida tez va samarali veb-ilovalar, API'lar va boshqa server dasturlarini qurish mumkin. Node.js asinxron va event-driven modelga asoslangan bo'lib, bu uni yuqori unumdorlikka ega qiladi. Express.js kabi freymvorklar bilan birgalikda ishlatilganda, veb-ilovalar yaratish jarayoni yanada soddalashadi.",
  },
  {
    id: 2,
    title: "Express.js asoslari",
    author: "Gulnora Karimova",
    date: "2024-07-12",
    content:
      "Express.js - bu Node.js uchun minimal va moslashuvchan veb-ilovalar freymvorki. U veb-ilovalar va API'lar yaratish uchun kuchli xususiyatlar to'plamini taqdim etadi. Express.js yordamida marshrutlash, middleware'lar va shablon dvigatellarini osongina boshqarish mumkin. Bu freymvork RESTful API'lar va server-rendered ilovalar uchun keng qo'llaniladi.",
  },
  {
    id: 3,
    title: "EJS shablon dvigateli",
    author: "Davron Ismoilov",
    date: "2024-07-14",
    content:
      "EJS (Embedded JavaScript) - bu JavaScript yordamida HTML shablonlarini yaratish imkonini beruvchi mashhur shablon dvigateli. Uning yordamida server tomonidan dinamik HTML sahifalarini yaratish mumkin. EJS oddiy sintaksisga ega bo'lib, HTML ichida JavaScript kodini yozishga imkon beradi. Bu, ayniqsa, ma'lumotlar bazasidan olingan ma'lumotlarni veb-sahifalarda ko'rsatishda juda qulay.",
  },
]

// Bosh sahifa marshruti (online do'kon mahsulotlari)
app.get("/", (req, res) => {
  res.render("index", {
    products: products, // Online store products
    cartCount: req.session.cart
      ? req.session.cart.reduce((sum, id) => sum + (products.find((p) => p.id === id) ? 1 : 0), 0)
      : 0,
  })
})

// Blog postlarini ko'rsatish (Asosiy blog sahifasi)
app.get("/blog", (req, res) => {
  res.render("blog-home", {
    // blog-home.ejs fayli yaratilmagan bo'lsa, uni yaratish kerak
    posts: posts,
    cartCount: req.session.cart ? req.session.cart.length : 0,
  })
})

// Yangi post yaratish sahifasi (GET)
app.get("/create", (req, res) => {
  res.render("create", {
    cartCount: req.session.cart ? req.session.cart.length : 0,
  })
})

// Yangi post yaratish (POST)
app.post("/create", (req, res) => {
  const { title, author, content } = req.body
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title,
    author,
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
    content,
  }
  posts.push(newPost)
  res.redirect("/admin") // Post yaratilgandan so'ng admin paneliga yo'naltirish
})

// Admin panel sahifasi (GET)
app.get("/admin", (req, res) => {
  res.render("admin", {
    posts: posts,
    cartCount: req.session.cart ? req.session.cart.length : 0,
  })
})

// Postni o'chirish (DELETE)
app.delete("/post/:id", (req, res) => {
  const postId = Number.parseInt(req.params.id)
  const initialLength = posts.length
  posts = posts.filter((post) => post.id !== postId)
  if (posts.length < initialLength) {
    res.json({ success: true, message: "Post muvaffaqiyatli o'chirildi." })
  } else {
    res.status(404).json({ success: false, error: "Post topilmadi." })
  }
})

// Yagona blog postini ko'rsatish
app.get("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id)
  if (post) {
    res.render("post", {
      post: post,
      cartCount: req.session.cart ? req.session.cart.length : 0,
    })
  } else {
    res.status(404).render("404", { cartCount: req.session.cart ? req.session.cart.length : 0 })
  }
})

// Mahsulotlar sahifasi
app.get("/products", (req, res) => {
  let filteredProducts = products
  const category = req.query.category
  const search = req.query.search

  if (category) {
    filteredProducts = products.filter((p) => p.category === category)
  }

  if (search) {
    filteredProducts = filteredProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }

  res.render("products", {
    products: filteredProducts,
    categories,
    selectedCategory: category,
    searchQuery: search,
    cart: req.session.cart || [],
  })
})

// Mahsulot batafsil
app.get("/product/:id", (req, res) => {
  const product = products.find((p) => p.id == req.params.id)
  if (product) {
    const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    res.render("product-detail", {
      product,
      relatedProducts,
      cart: req.session.cart || [],
    })
  } else {
    res.status(404).render("404")
  }
})

// Savatga qo'shish
app.post("/add-to-cart", (req, res) => {
  const productId = Number.parseInt(req.body.productId)
  const quantity = Number.parseInt(req.body.quantity) || 1

  if (!req.session.cart) {
    req.session.cart = []
  }

  const existingItem = req.session.cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    const product = products.find((p) => p.id === productId)
    if (product) {
      req.session.cart.push({
        productId: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    }
  }

  res.json({ success: true, cartCount: req.session.cart.length })
})

// Savatdan o'chirish
app.post("/remove-from-cart", (req, res) => {
  const productId = Number.parseInt(req.body.productId)

  if (req.session.cart) {
    req.session.cart = req.session.cart.filter((item) => item.productId !== productId)
  }

  res.json({ success: true })
})

// Savat sahifasi
app.get("/cart", (req, res) => {
  const cart = req.session.cart || []
  let total = 0

  cart.forEach((item) => {
    total += item.price * item.quantity
  })

  res.render("cart", { cart, total })
})

// Buyurtma berish
app.get("/checkout", (req, res) => {
  const cart = req.session.cart || []
  let total = 0

  cart.forEach((item) => {
    total += item.price * item.quantity
  })

  res.render("checkout", { cart, total })
})

// Buyurtmani tasdiqlash
app.post("/place-order", (req, res) => {
  const { name, phone, address, paymentMethod } = req.body

  // Bu yerda buyurtmani ma'lumotlar bazasiga saqlash kerak
  // Hozircha faqat session'ni tozalaymiz
  req.session.cart = []

  res.render("order-success", {
    orderNumber: Math.floor(Math.random() * 100000),
    customerName: name,
  })
})

// Biz haqimizda sahifasi (yangi about.ejs dan foydalanish)
app.get("/about", (req, res) => {
  res.render("about", {
    cartCount: req.session.cart ? req.session.cart.length : 0,
  })
})

// Aloqa
app.get("/contact", (req, res) => {
  res.render("contact")
})

// 404 sahifasi (yangi 404.ejs dan foydalanish)
app.use((req, res) => {
  res.status(404).render("404", {
    cartCount: req.session.cart ? req.session.cart.length : 0,
  })
})

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Online Magazin http://localhost:${PORT} da ishlamoqda`)
})
