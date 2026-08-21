const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');

router.post('/', protect, restrictTo('artisan'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, restrictTo('artisan'), updateProduct);






module.exports = router;