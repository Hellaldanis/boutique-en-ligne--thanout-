const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { optionalAuth, authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { contactMessageValidation, idParamValidation } = require('../validators');

// Routes publiques
router.post('/', optionalAuth, contactMessageValidation, validate, contactController.sendMessage);

// Routes admin
router.get('/', authenticateToken, requireAdmin, contactController.getMessages);
router.get('/:id', authenticateToken, requireAdmin, idParamValidation, validate, contactController.getMessage);
router.post('/:id/respond', authenticateToken, requireAdmin, idParamValidation, validate, contactController.respondToMessage);
router.patch('/:id/read', authenticateToken, requireAdmin, idParamValidation, validate, contactController.markAsRead);

module.exports = router;
