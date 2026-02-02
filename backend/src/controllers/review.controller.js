const reviewService = require('../services/review.service');

class ReviewController {
  // Créer un avis
  async createReview(req, res, next) {
    try {
      const { productId } = req.params;
      const review = await reviewService.createReview(req.user.id, productId, req.body);
      res.status(201).json({
        message: 'Avis publié avec succès',
        review
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les avis d'un produit
  async getProductReviews(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await reviewService.getProductReviews(productId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Marquer un avis comme utile
  async markHelpful(req, res, next) {
    try {
      const { reviewId } = req.params;
      const result = await reviewService.markReviewHelpful(req.user.id, reviewId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Supprimer son avis
  async deleteReview(req, res, next) {
    try {
      const { reviewId } = req.params;
      const result = await reviewService.deleteReview(req.user.id, reviewId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
