const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { idParamValidation } = require('../validators');

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

router.get('/', favoriteController.getFavorites);
router.post('/:productId', idParamValidation, validate, favoriteController.addFavorite);
router.delete('/:productId', idParamValidation, validate, favoriteController.removeFavorite);
router.get('/:productId/check', idParamValidation, validate, favoriteController.checkFavorite);

module.exports = router;
