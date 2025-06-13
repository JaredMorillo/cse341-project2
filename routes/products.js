const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/authenticate');
const productsController = require('../controllers/products');

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getSingleProduct);
router.post('/', isAuthenticated, productsController.createProduct);
router.put('/:id', isAuthenticated, productsController.updateProduct);
router.delete('/:id', isAuthenticated, productsController.deleteProduct);

module.exports = router;