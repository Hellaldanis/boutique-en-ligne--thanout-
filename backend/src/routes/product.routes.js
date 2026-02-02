const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProductValidation, idParamValidation } = require('../validators');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProduct);
router.get('/:id/related', idParamValidation, validate, productController.getRelatedProducts);

// Routes admin
router.post('/', authenticateToken, requireAdmin, createProductValidation, validate, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, idParamValidation, validate, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, idParamValidation, validate, productController.deleteProduct);

module.exports = router;
