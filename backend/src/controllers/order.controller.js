const orderService = require('../services/order.service');

class OrderController {
  // Créer une commande
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(req.user.id, {
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
      
      res.status(201).json({
        message: 'Commande créée avec succès',
        order
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les commandes de l'utilisateur
  async getUserOrders(req, res, next) {
    try {
      const result = await orderService.getUserOrders(req.user.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Obtenir une commande spécifique
  async getOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrder(id, req.user.id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // Annuler une commande
  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await orderService.cancelOrder(id, req.user.id, reason);
      res.json({
        message: 'Commande annulée avec succès',
        order
      });
    } catch (error) {
      next(error);
    }
  }

  // Valider un code promo
  async validatePromoCode(req, res, next) {
    try {
      const { code, cartTotal } = req.body;
      const result = await orderService.validatePromoCode(code, req.user.id, cartTotal);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
