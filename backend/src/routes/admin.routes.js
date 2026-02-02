const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard & Statistics
router.get('/dashboard', adminController.getDashboard);
router.get('/statistics', adminController.getStatistics);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/role', adminController.updateUserRole);

// Promo Code Management
router.get('/promo-codes', adminController.getPromoCodes);
router.post('/promo-codes', adminController.createPromoCode);
router.put('/promo-codes/:id', adminController.updatePromoCode);
router.delete('/promo-codes/:id', adminController.deletePromoCode);

// Activity Logs
router.get('/activity-logs', adminController.getActivityLogs);

module.exports = router;
