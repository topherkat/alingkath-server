const express = require("express");
const cartController = require("../controllers/cart");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Retrieve cart route
router.get("/", verify, cartController.retrieveCart);

// add cart route
router.post("/", verify, cartController.addToCart);

// Update cart quantity route
router.patch("/update-qty", verify, cartController.updateCartQuantity);

// Remove from cart route
router.patch(
  "/remove-from-cart/:productId",
  verify,
  cartController.removeFromCart
);

// Clear cart route
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;
