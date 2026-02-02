const favoriteService = require('../services/favorite.service');

class FavoriteController {
  // Obtenir tous les favoris
  async getFavorites(req, res, next) {
    try {
      const favorites = await favoriteService.getUserFavorites(req.user.id);
      res.json(favorites);
    } catch (error) {
      next(error);
    }
  }

  // Ajouter un favori
  async addFavorite(req, res, next) {
    try {
      const { productId } = req.params;
      const favorite = await favoriteService.addFavorite(req.user.id, productId);
      res.status(201).json({
        message: 'Produit ajouté aux favoris',
        favorite
      });
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un favori
  async removeFavorite(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await favoriteService.removeFavorite(req.user.id, productId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Vérifier si un produit est en favori
  async checkFavorite(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await favoriteService.isFavorite(req.user.id, productId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FavoriteController();
