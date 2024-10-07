const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Create product route
router.post("/add", verify, verifyAdmin, productController.createProduct);

// Retrieve all products
router.get("/all", verify, verifyAdmin, productController.getAllProduct);

// Retrieve all active products
router.get("/", productController.getAllActive);

// Retrieve single products using ID
router.get("/:productId",verify, productController.getProduct);

// Update product
router.patch("/update/:productId", verify, verifyAdmin, productController.updateProduct);

// Archive the product
router.patch("/archive/:productId",
  verify,
  verifyAdmin,
  productController.archiveProduct
);

// Activate the product
router.patch("/activate/:productId", verify,
  verifyAdmin,
  productController.activateProduct
);


router.post('/search-products', productController.searchProductByName);
// Search product by price range route
router.post(
  "/search-by-price",
  productController.searchProductByPriceRange
);




module.exports = router;
