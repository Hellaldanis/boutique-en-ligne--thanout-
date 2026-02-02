const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');

// Routes publiques
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategory);

// Routes admin
router.post('/', authenticateToken, requireAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
