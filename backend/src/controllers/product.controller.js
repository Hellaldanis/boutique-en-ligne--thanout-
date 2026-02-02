const productService = require('../services/product.service');

class ProductController {
  // Obtenir tous les produits
  async getProducts(req, res, next) {
    try {
      const result = await productService.getProducts(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Obtenir un produit par son slug
  async getProduct(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await productService.getProductBySlug(slug);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // Créer un produit (Admin)
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        message: 'Produit créé avec succès',
        product
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un produit (Admin)
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.json({
        message: 'Produit mis à jour avec succès',
        product
      });
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un produit (Admin)
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les produits liés
  async getRelatedProducts(req, res, next) {
    try {
      const { id } = req.params;
      const products = await productService.getRelatedProducts(id);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
