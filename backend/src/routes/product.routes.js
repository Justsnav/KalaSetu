const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');

console.log("createProduct:", typeof createProduct);
console.log("getAllProducts:", typeof getAllProducts);
console.log("getProductById:", typeof getProductById);
console.log("updateProduct:", typeof updateProduct);
console.log("deleteProduct:", typeof deleteProduct);
console.log("protect:", typeof protect);
console.log("restrictTo:", typeof restrictTo);
console.log("restrictTo('artisan'):", typeof restrictTo('artisan'));

router.post('/', protect, restrictTo('artisan'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, restrictTo('artisan'), updateProduct);
router.delete('/:id', protect, restrictTo('artisan'), deleteProduct);


console.log(
  router.stack.map(layer =>
    layer.route ? `${Object.keys(layer.route.methods)} ${layer.route.path}` : 'other'
  )
);



module.exports = router;