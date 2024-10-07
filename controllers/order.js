const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require("../auth");
const { errorHandler } = auth;

module.exports.checkout = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (via JWT, session, etc.)
    const userId = req.user.id;

    // Destructure products from the request body
    const { productsOrdered } = req.body;

    if (!productsOrdered || productsOrdered.length === 0) {
      return res.status(400).json({ message: "No products provided for checkout." });
    }

    let totalPrice = 0; // Initialize totalPrice

    // Check that each product exists in the database and has a valid quantity
    for (let product of productsOrdered) {
      const existingProduct = await Product.findById(product.productId);

      if (!existingProduct) {
        return res.status(404).json({ message: `Product ${product.productName} not found.` });
      }

      // Ensure the ordered quantity is available
      if (product.quantity > existingProduct.stock) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.productName}.` });
      }

      // Calculate the subtotal for the current product and add to totalPrice
      const subtotal = existingProduct.price * product.quantity;
      totalPrice += subtotal;
    }

    // Create a new order with the products and the computed totalPrice
    const newOrder = new Order({
      userId,
      productsOrdered,
      totalPrice, // Now it's computed automatically
    });

    // Save the order to the database
    await newOrder.save();

    // Optionally, update the product stock in the database
    for (let product of productsOrdered) {
      await Product.findByIdAndUpdate(
        product.productId,
        { $inc: { stock: -product.quantity } }
      );
    }

    // Send a success response
    return res.status(201).json({
      message: "Checkout successful! Your order has been placed.",
      order: newOrder,
    });

  } catch (error) {
    console.error("Error during checkout:", error.message);
    return res.status(500).json({ message: "An error occurred during checkout", error: error.message });
  }
};

module.exports.getOrders = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (via JWT, session, etc.)
    const userId = req.user.id;

    // Find orders associated with the user
    const orders = await Order.find({ userId });

    // Check if there are any orders for the user
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Send a success response with the orders
    return res.status(200).json({
      message: "Orders retrieved successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error.message);
    return res.status(500).json({ message: "An error occurred while retrieving orders", error: error.message });
  }
};


module.exports.getOrderById = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (via JWT, session, etc.)
    const userId = req.user.id;

    // Extract the order ID from the request parameters
    const { orderId } = req.params;

    // Find the order by ID and ensure it belongs to the user
    const order = await Order.findOne({ _id: orderId, userId });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found or you do not have permission to view it." });
    }

    // Send a success response with the order details
    return res.status(200).json({
      message: "Order retrieved successfully.",
      order,
    });
  } catch (error) {
    console.error("Error retrieving order:", error.message);
    return res.status(500).json({ message: "An error occurred while retrieving the order", error: error.message });
  }
};

module.exports.getAllOrders = (req, res) => {
  Order.find({})
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({ message: "No Orders Yet" });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.updateOrderStatus = (req, res) => {
  const { orderId } = req.params;

  Order.findByIdAndUpdate(orderId, { status: 'Completed' }, { new: true })
    .then((updatedOrder) => {
      if (updatedOrder) {
        return res.status(200).send({
          message: 'Order status updated to Completed',
          order: updatedOrder,
        });
      } else {
        return res.status(404).send({ message: 'Order not found' });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};
