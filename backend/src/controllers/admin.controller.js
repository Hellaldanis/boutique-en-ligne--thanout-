const adminService = require('../services/admin.service');
const { logger } = require('../middlewares/errorHandler.middleware');

class AdminController {
  // GET /api/admin/dashboard
  async getDashboard(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error in getDashboard:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
  }

  // GET /api/admin/statistics
  async getStatistics(req, res) {
    try {
      const { period = '30d' } = req.query;
      const stats = await adminService.getDetailedStats(period);
      res.json(stats);
    } catch (error) {
      logger.error('Error in getStatistics:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
  }

  // GET /api/admin/users
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 50, search = '', filter = 'all' } = req.query;
      const result = await adminService.getAllUsers(
        parseInt(page),
        parseInt(limit),
        search,
        filter
      );
      res.json(result);
    } catch (error) {
      logger.error('Error in getUsers:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  }

  // PUT /api/admin/users/:id/ban
  async banUser(req, res) {
    try {
      const { id } = req.params;
      const { accountSuspended, suspensionReason } = req.body;

      const user = await adminService.updateUserStatus(
        id,
        accountSuspended,
        suspensionReason
      );

      // Log activity
      await adminService.logActivity(
        req.user.adminId,
        accountSuspended ? 'ban_user' : 'unban_user',
        'user',
        id,
        { reason: suspensionReason }
      );

      res.json({
        message: `Utilisateur ${accountSuspended ? 'banni' : 'débanni'} avec succès`,
        user
      });
    } catch (error) {
      logger.error('Error in banUser:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
  }

  // PUT /api/admin/users/:id/role
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['admin', 'customer'].includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide' });
      }

      await adminService.updateUserRole(id, role);

      // Log activity
      await adminService.logActivity(
        req.user.adminId,
        'update_user_role',
        'user',
        id,
        { newRole: role }
      );

      res.json({
        message: 'Rôle mis à jour avec succès'
      });
    } catch (error) {
      logger.error('Error in updateUserRole:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle' });
    }
  }

  // GET /api/admin/promo-codes
  async getPromoCodes(req, res) {
    try {
      const promoCodes = await adminService.getAllPromoCodes();
      res.json(promoCodes);
    } catch (error) {
      logger.error('Error in getPromoCodes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des codes promo' });
    }
  }

  // POST /api/admin/promo-codes
  async createPromoCode(req, res) {
    try {
      const promoCode = await adminService.createPromoCode(req.body);

      // Log activity
      await adminService.logActivity(
        req.user.adminId,
        'create_promo_code',
        'promo_code',
        promoCode.id,
        { code: promoCode.code }
      );

      res.status(201).json({
        message: 'Code promo créé avec succès',
        promoCode
      });
    } catch (error) {
      logger.error('Error in createPromoCode:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Ce code promo existe déjà' });
      }
      res.status(500).json({ message: 'Erreur lors de la création du code promo' });
    }
  }

  // PUT /api/admin/promo-codes/:id
  async updatePromoCode(req, res) {
    try {
      const { id } = req.params;
      const promoCode = await adminService.updatePromoCode(id, req.body);

      // Log activity
      await adminService.logActivity(
        req.user.adminId,
        'update_promo_code',
        'promo_code',
        id,
        { code: promoCode.code }
      );

      res.json({
        message: 'Code promo mis à jour avec succès',
        promoCode
      });
    } catch (error) {
      logger.error('Error in updatePromoCode:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Code promo non trouvé' });
      }
      res.status(500).json({ message: 'Erreur lors de la mise à jour du code promo' });
    }
  }

  // DELETE /api/admin/promo-codes/:id
  async deletePromoCode(req, res) {
    try {
      const { id } = req.params;
      await adminService.deletePromoCode(id);

      // Log activity
      await adminService.logActivity(
        req.user.adminId,
        'delete_promo_code',
        'promo_code',
        id
      );

      res.json({ message: 'Code promo supprimé avec succès' });
    } catch (error) {
      logger.error('Error in deletePromoCode:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Code promo non trouvé' });
      }
      res.status(500).json({ message: 'Erreur lors de la suppression du code promo' });
    }
  }

  // GET /api/admin/activity-logs
  async getActivityLogs(req, res) {
    try {
      const { page = 1, limit = 50, adminId, action, entityType } = req.query;
      
      const filters = {};
      if (adminId) filters.adminId = adminId;
      if (action) filters.action = action;
      if (entityType) filters.entityType = entityType;

      const result = await adminService.getActivityLogs(
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.json(result);
    } catch (error) {
      logger.error('Error in getActivityLogs:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des logs' });
    }
  }
}

module.exports = new AdminController();
