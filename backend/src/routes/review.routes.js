const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createReviewValidation, idParamValidation } = require('../validators');

// Routes publiques
router.get('/product/:productId', idParamValidation, validate, reviewController.getProductReviews);

// Routes protégées
router.use(authenticateToken);
router.post('/product/:productId', idParamValidation, createReviewValidation, validate, reviewController.createReview);
router.post('/:reviewId/helpful', idParamValidation, validate, reviewController.markHelpful);
router.delete('/:reviewId', idParamValidation, validate, reviewController.deleteReview);

module.exports = router;
