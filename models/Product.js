const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String,
        required: false  // Make this required if you want all products to have an image
    }
});

// Create the product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
