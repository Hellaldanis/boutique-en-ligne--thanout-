const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateTokens } = require('../utils/jwt');
const crypto = require('crypto');

const prisma = new PrismaClient();

class AuthService {
  // Inscription
  async register(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Hash du mot de passe
    const passwordHash = await hashPassword(password);

    // Générer un token de vérification
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        emailVerificationToken
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Générer les tokens
    const tokens = generateTokens(user.id);

    // TODO: Envoyer l'email de vérification

    return { user, ...tokens };
  }

  // Connexion
  async login(email, password) {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        adminUser: {
          select: {
            role: true,
            permissions: true,
            isActive: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new Error('Compte désactivé');
    }

    if (user.accountSuspended) {
      throw new Error('Compte suspendu');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Générer les tokens
    const tokens = generateTokens(user.id);

    // Supprimer le hash du mot de passe de la réponse
    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...tokens };
  }

  // Vérification email
  async verifyEmail(token) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      throw new Error('Token de vérification invalide');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null
      }
    });

    return { message: 'Email vérifié avec succès' };
  }

  // Demande de réinitialisation du mot de passe
  async forgotPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 heure

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    // TODO: Envoyer l'email avec le lien de réinitialisation

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  // Réinitialisation du mot de passe
  async resetPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Token de réinitialisation invalide ou expiré');
    }

    // Hash du nouveau mot de passe
    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  // Changement de mot de passe
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Hash du nouveau mot de passe
    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    return { message: 'Mot de passe changé avec succès' };
  }

  // Obtenir le profil utilisateur
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
        adminUser: {
          select: {
            role: true,
            permissions: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  // Mettre à jour le profil
  async updateProfile(userId, updateData) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        avatarUrl: true,
        updatedAt: true
      }
    });

    return user;
  }
}

module.exports = new AuthService();
