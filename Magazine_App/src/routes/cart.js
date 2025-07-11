const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const cartItems = req.session.cart || [];
  res.render("cart", { cartItems });
});

module.exports = router;
