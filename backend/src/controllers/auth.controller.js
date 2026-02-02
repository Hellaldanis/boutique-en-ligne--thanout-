const authService = require('../services/auth.service');

class AuthController {
  // Inscription
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'Inscription réussie',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Connexion
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      // Envoyer le refresh token comme cookie HTTP-only
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

      res.json({
        message: 'Connexion réussie',
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  // Déconnexion
  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      next(error);
    }
  }

  // Vérification email
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Mot de passe oublié
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Changer le mot de passe
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Obtenir le profil
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour le profil
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      res.json({
        message: 'Profil mis à jour avec succès',
        user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
