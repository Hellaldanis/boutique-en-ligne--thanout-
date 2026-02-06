const prisma = require('../lib/prisma');

class CategoryService {
  // Obtenir toutes les catégories
  async getCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return categories;
  }

  // Obtenir une catégorie par slug
  async getCategoryBySlug(slug) {
    const category = await prisma.category.findFirst({
      where: { slug, isActive: true },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        parentCategory: true
      }
    });

    if (!category) {
      throw new Error('Catégorie non trouvée');
    }

    return category;
  }

  // Créer une catégorie (Admin)
  async createCategory(categoryData) {
    const category = await prisma.category.create({
      data: categoryData
    });

    return category;
  }

  // Mettre à jour une catégorie (Admin)
  async updateCategory(id, updateData) {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return category;
  }

  // Supprimer une catégorie (Admin - soft delete)
  async deleteCategory(id) {
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });

    return { message: 'Catégorie supprimée avec succès' };
  }
}

module.exports = new CategoryService();
