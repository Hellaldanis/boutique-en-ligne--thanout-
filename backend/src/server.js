require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { errorHandler, notFound, logger } = require('./middlewares/errorHandler.middleware');
const prisma = require('./lib/prisma');
const { generalLimiter } = require('./middlewares/rateLimiter.middleware');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const reviewRoutes = require('./routes/review.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const categoryRoutes = require('./routes/category.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');
const promoRoutes = require('./routes/promo.routes');

const app = express();

// Fix pour la sérialisation BigInt en JSON
BigInt.prototype.toJSON = function() {
  return this.toString();
};

// Configuration CORS - accepte plusieurs origines de dev + production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin (ex: curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares de sécurité
app.use(helmet());
app.use(cors(corsOptions));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promo-codes', promoRoutes);

// Route 404
app.use(notFound);

// Error handler (doit être le dernier middleware)
app.use(errorHandler);

// Gestion de la fermeture propre
process.on('SIGINT', async () => {
  logger.info('Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
  logger.info(`📦 Environnement: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 CORS autorisé pour: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
