const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { optionalAuth } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

// Validation de code promo (route publique)
router.get('/validate/:code', optionalAuth, async (req, res, next) => {
  try {
    const { code } = req.params;
    
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode) {
      return res.status(404).json({ 
        success: false,
        message: 'Code promo invalide' 
      });
    }

    // Vérifier si le code est actif
    if (!promoCode.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce code promo n\'est plus actif' 
      });
    }

    // Vérifier les dates de validité
    const now = new Date();
    if (promoCode.validFrom && new Date(promoCode.validFrom) > now) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce code promo n\'est pas encore valide' 
      });
    }
    if (promoCode.validUntil && new Date(promoCode.validUntil) < now) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce code promo a expiré' 
      });
    }

    // Vérifier la limite d'utilisation
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce code promo a atteint sa limite d\'utilisation' 
      });
    }

    // Vérifier si l'utilisateur a déjà utilisé ce code
    if (req.user) {
      const existingUsage = await prisma.promoCodeUsage.findFirst({
        where: {
          promoId: promoCode.id,
          userId: req.user.id
        }
      });

      if (existingUsage) {
        return res.status(400).json({ 
          success: false,
          message: 'Vous avez déjà utilisé ce code promo' 
        });
      }
    }

    res.json({
      success: true,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      minPurchaseAmount: promoCode.minPurchaseAmount,
      maxDiscountAmount: promoCode.maxDiscountAmount
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
