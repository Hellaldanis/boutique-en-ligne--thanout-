const { Prisma } = require('@prisma/client');
const winston = require('winston');

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

const errorHandler = (err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?.id
  });

  // Erreurs Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Conflit de données',
          message: `La valeur du champ ${err.meta?.target} existe déjà`
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Ressource non trouvée',
          message: 'L\'enregistrement demandé n\'existe pas'
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Erreur de référence',
          message: 'La ressource référencée n\'existe pas'
        });
      default:
        return res.status(400).json({
          error: 'Erreur de base de données',
          message: err.message
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: 'Données invalides'
    });
  }

  // Erreurs de validation personnalisées
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.details
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide',
      message: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré',
      message: 'Veuillez vous reconnecter'
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Erreur interne du serveur'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
};

module.exports = { errorHandler, notFound, logger };
