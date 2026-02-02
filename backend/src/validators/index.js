const { body, param, query } = require('express-validator');

// Validation pour l'inscription
const registerValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      if (!/^(0|\+213)[5-7][0-9]{8}$/.test(value)) {
        throw new Error('Numéro de téléphone algérien invalide (ex: 0555123456)');
      }
      return true;
    })
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

// Validation pour le rafraîchissement du token
const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Le refresh token est requis')
];

// Validation pour la réinitialisation du mot de passe
const forgotPasswordValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
];

const resetPasswordValidation = [
  body('token')
    .notEmpty().withMessage('Le token est requis'),
  body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre')
];

// Validation pour le changement de mot de passe
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le nouveau mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le nouveau mot de passe doit contenir au moins une lettre minuscule')
    .matches(/\d/).withMessage('Le nouveau mot de passe doit contenir au moins un chiffre')
];

// Validation pour la mise à jour du profil
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('phone')
    .optional()
    .trim()
    .matches(/^(0|\+213)[5-7][0-9]{8}$/).withMessage('Numéro de téléphone algérien invalide'),
  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Date de naissance invalide')
];

// Validation pour les produits
const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom du produit est requis')
    .isLength({ max: 255 }).withMessage('Le nom ne peut pas dépasser 255 caractères'),
  body('categoryId')
    .isInt({ min: 1 }).withMessage('Catégorie invalide'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('stockQuantity')
    .isInt({ min: 0 }).withMessage('La quantité en stock doit être un nombre entier positif'),
  body('description')
    .optional()
    .trim()
];

// Validation pour les commandes
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('La commande doit contenir au moins un article'),
  body('items.*.productId')
    .isInt({ min: 1 }).withMessage('ID produit invalide'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('La quantité doit être au moins 1'),
  body('paymentMethod')
    .isIn(['cash_on_delivery', 'card', 'bank_transfer']).withMessage('Méthode de paiement invalide'),
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Le nom complet est requis'),
  body('shippingAddress.phone')
    .trim()
    .matches(/^(0|\+213)[5-7][0-9]{8}$/).withMessage('Numéro de téléphone invalide'),
  body('shippingAddress.addressLine1')
    .trim()
    .notEmpty().withMessage('L\'adresse est requise'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('La ville est requise'),
  body('shippingAddress.wilaya')
    .trim()
    .notEmpty().withMessage('La wilaya est requise')
];

// Validation pour les avis
const createReviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Le commentaire est requis')
    .isLength({ min: 10, max: 1000 }).withMessage('Le commentaire doit contenir entre 10 et 1000 caractères'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le titre ne peut pas dépasser 200 caractères')
];

// Validation pour les codes promo
const validatePromoCodeValidation = [
  body('code')
    .trim()
    .notEmpty().withMessage('Le code promo est requis')
    .toUpperCase()
];

// Validation pour les IDs dans les paramètres
const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID invalide')
];

// Validation pour la newsletter
const newsletterValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
];

// Validation pour le message de contact
const contactMessageValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ max: 200 }).withMessage('Le nom ne peut pas dépasser 200 caractères'),
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty().withMessage('Le sujet est requis')
    .isLength({ max: 255 }).withMessage('Le sujet ne peut pas dépasser 255 caractères'),
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10 }).withMessage('Le message doit contenir au moins 10 caractères')
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
  createProductValidation,
  createOrderValidation,
  createReviewValidation,
  validatePromoCodeValidation,
  idParamValidation,
  newsletterValidation,
  contactMessageValidation
};
