const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isVerified: true,
        accountSuspended: true,
        adminUser: {
          select: {
            id: true,
            role: true,
            permissions: true,
            isActive: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    if (user.accountSuspended) {
      return res.status(403).json({ error: 'Compte suspendu' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    return res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!req.user.adminUser || !req.user.adminUser.isActive) {
      return res.status(403).json({ error: 'Accès administrateur requis' });
    }

    // Store adminId for activity logging
    req.user.adminId = req.user.adminUser.id;

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erreur de vérification des permissions' });
  }
};

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.adminUser) {
        return res.status(403).json({ error: 'Accès administrateur requis' });
      }

      if (!roles.includes(req.user.adminUser.role)) {
        return res.status(403).json({ error: 'Permissions insuffisantes' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erreur de vérification des permissions' });
    }
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    });

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  optionalAuth
};
