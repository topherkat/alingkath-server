const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  productsOrdered: [
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
        required: [true, "Subtotal is required"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("order", orderSchema);
