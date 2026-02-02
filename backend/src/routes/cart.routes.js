const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

// Toutes les routes utilisent l'authentification optionnelle
router.use(optionalAuth);

router.get('/', cartController.getCart);

router.post('/items', [
  body('productId').isInt({ min: 1 }).withMessage('ID produit invalide'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('variantId').optional().isInt({ min: 1 }).withMessage('ID variante invalide')
], validate, cartController.addItem);

router.put('/items/:itemId', [
  body('quantity').isInt({ min: 0 }).withMessage('Quantité invalide')
], validate, cartController.updateItem);

router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
