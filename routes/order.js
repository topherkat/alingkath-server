const express = require("express");
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();
console.log(orderController)

// Create product route
router.post("/checkout", verify, orderController.checkout);
router.get("/", verify, orderController.getOrders);
router.get('/all', verify, orderController.getAllOrders);	
router.get('/:orderId', verifyAdmin, orderController.getOrderById);
router.patch('/complete/:orderId/', verify, orderController.updateOrderStatus);

module.exports = router;