const cartService = require('../services/cart.service');

class CartController {
  // Obtenir le panier
  async getCart(req, res, next) {
    try {
      const userId = req.user?.id;
      const sessionId = req.sessionID || req.get('x-session-id');
      
      const cart = await cartService.getOrCreateCart(userId, sessionId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // Ajouter un article au panier
  async addItem(req, res, next) {
    try {
      const userId = req.user?.id;
      const sessionId = req.sessionID || req.get('x-session-id');
      
      const cart = await cartService.addItem(userId, sessionId, req.body);
      res.status(201).json({
        message: 'Article ajouté au panier',
        cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un article du panier
  async updateItem(req, res, next) {
    try {
      const userId = req.user?.id;
      const sessionId = req.sessionID || req.get('x-session-id');
      const { itemId } = req.params;
      const { quantity } = req.body;
      
      const cart = await cartService.updateItem(userId, sessionId, itemId, quantity);
      res.json({
        message: 'Panier mis à jour',
        cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un article du panier
  async removeItem(req, res, next) {
    try {
      const userId = req.user?.id;
      const sessionId = req.sessionID || req.get('x-session-id');
      const { itemId } = req.params;
      
      const cart = await cartService.removeItem(userId, sessionId, itemId);
      res.json({
        message: 'Article supprimé du panier',
        cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Vider le panier
  async clearCart(req, res, next) {
    try {
      const userId = req.user?.id;
      const sessionId = req.sessionID || req.get('x-session-id');
      
      const cart = await cartService.clearCart(userId, sessionId);
      res.json({
        message: 'Panier vidé',
        cart
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
