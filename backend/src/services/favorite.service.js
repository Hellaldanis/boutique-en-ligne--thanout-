const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class FavoriteService {
  // Obtenir les favoris d'un utilisateur
  async getUserFavorites(userId) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { displayOrder: 'asc' } },
            category: { select: { name: true } },
            brand: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les notes moyennes
    const favoritesWithRating = await Promise.all(
      favorites.map(async (fav) => {
        const avgRating = await prisma.productReview.aggregate({
          where: { productId: fav.product.id, isApproved: true },
          _avg: { rating: true },
          _count: { rating: true }
        });

        return {
          ...fav,
          product: {
            ...fav.product,
            averageRating: avgRating._avg.rating || 0,
            reviewCount: avgRating._count.rating
          }
        };
      })
    );

    return favoritesWithRating;
  }

  // Ajouter un favori
  async addFavorite(userId, productId) {
    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    // Vérifier si déjà en favori
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      }
    });

    if (existing) {
      throw new Error('Produit déjà dans les favoris');
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId)
      }
    });

    return favorite;
  }

  // Supprimer un favori
  async removeFavorite(userId, productId) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      }
    });

    if (!favorite) {
      throw new Error('Favori non trouvé');
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      }
    });

    return { message: 'Produit retiré des favoris' };
  }

  // Vérifier si un produit est en favori
  async isFavorite(userId, productId) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      }
    });

    return { isFavorite: !!favorite };
  }
}

module.exports = new FavoriteService();
