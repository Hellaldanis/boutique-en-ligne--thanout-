const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { newsletterValidation } = require('../validators');

// Routes publiques
router.post('/subscribe', newsletterValidation, validate, newsletterController.subscribe);
router.get('/unsubscribe/:token', newsletterController.unsubscribe);

// Routes admin
router.get('/subscribers', authenticateToken, requireAdmin, newsletterController.getSubscribers);

module.exports = router;
