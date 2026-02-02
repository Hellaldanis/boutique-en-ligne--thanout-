const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrderValidation, validatePromoCodeValidation, idParamValidation } = require('../validators');

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

router.post('/', createOrderValidation, validate, orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', idParamValidation, validate, orderController.getOrder);
router.post('/:id/cancel', idParamValidation, validate, orderController.cancelOrder);
router.post('/validate-promo', validatePromoCodeValidation, validate, orderController.validatePromoCode);

module.exports = router;
