const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation
} = require('../validators');

// Routes publiques
router.post('/register', authLimiter, registerValidation, validate, authController.register);
router.post('/login', authLimiter, loginValidation, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidation, validate, authController.resetPassword);

// Routes protégées
router.use(authenticateToken);
router.get('/profile', authController.getProfile);
router.put('/profile', updateProfileValidation, validate, authController.updateProfile);
router.post('/change-password', changePasswordValidation, validate, authController.changePassword);

module.exports = router;
