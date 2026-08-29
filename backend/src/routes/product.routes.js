const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');


router.post('/', protect, restrictTo('artisan'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, restrictTo('artisan'), updateProduct);
router.delete('/:id', protect, restrictTo('artisan'), deleteProduct);




module.exports = router;