const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required"],
      },
      productName: {
        type: String,
        required: [true, "Product Name is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      subtotal: {
        type: Number,
        required: [true, "subtotal is required"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
