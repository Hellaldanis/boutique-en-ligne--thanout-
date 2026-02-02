const express = require('express');
const mockData = require('../data/mockData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock Auth Routes
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user exists
    const existingUser = mockData.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: mockData.users.length + 1,
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      phone,
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'customer'
    };

    mockData.users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockData.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/profile', (req, res) => {
  try {
    // Mock auth - in real app, decode JWT from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const user = mockData.users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Mock Products Routes
router.get('/products', (req, res) => {
  try {
    const { sortBy, limit, onSale, category } = req.query;
    let filteredProducts = [...mockData.products];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by on sale
    if (onSale === 'true') {
      filteredProducts = filteredProducts.filter(p => p.discount && p.discount > 0);
    }

    // Sort
    if (sortBy === 'newest') {
      filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'popular') {
      filteredProducts.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    // Limit
    if (limit) {
      filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }

    res.json({ products: filteredProducts });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/products/:id', (req, res) => {
  try {
    const product = mockData.products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Categories Routes
router.get('/categories', (req, res) => {
  try {
    res.json(mockData.categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Promo Codes Routes
router.get('/promo-codes/:code', (req, res) => {
  try {
    const promoCode = mockData.promoCodes.find(pc => pc.code.toUpperCase() === req.params.code.toUpperCase());
    if (!promoCode || !promoCode.isActive) {
      return res.status(404).json({ message: 'Code promo invalide ou expiré' });
    }

    res.json(promoCode);
  } catch (error) {
    console.error('Promo code error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Orders Routes
router.post('/orders', (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = {
      id: `ORD-${mockData.orderIdCounter++}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockData.orders.push(newOrder);

    res.status(201).json({ order: newOrder });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/orders/user', (req, res) => {
  try {
    // Mock - return all orders
    res.json({ orders: mockData.orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Contact Route
router.post('/contact/send', (req, res) => {
  try {
    console.log('Contact message received:', req.body);
    res.json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Favorites Routes
router.get('/favorites', (req, res) => {
  try {
    res.json({ favorites: [] });
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Cart Routes
router.get('/cart', (req, res) => {
  try {
    res.json({ items: [] });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mock Admin Routes
router.get('/admin/dashboard', (req, res) => {
  try {
    res.json({
      revenue: 1250000,
      revenueChange: 15,
      ordersCount: 324,
      ordersChange: 8,
      usersCount: mockData.users.length,
      usersChange: 12,
      productsCount: mockData.products.length,
      productsChange: 5,
      recentOrders: mockData.orders.slice(-5),
      topProducts: mockData.products.slice(0, 5)
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/admin/users', (req, res) => {
  try {
    res.json({ users: mockData.users });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/admin/promo-codes', (req, res) => {
  try {
    res.json(mockData.promoCodes);
  } catch (error) {
    console.error('Admin promo codes error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
