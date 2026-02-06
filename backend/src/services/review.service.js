const prisma = require('../lib/prisma');

class ReviewService {
  // Créer un avis
  async createReview(userId, productId, reviewData) {
    const { rating, title, comment } = reviewData;

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await prisma.productReview.findUnique({
      where: {
        productId_userId: {
          productId: parseInt(productId),
          userId: parseInt(userId)
        }
      }
    });

    if (existingReview) {
      throw new Error('Vous avez déjà laissé un avis pour ce produit');
    }

    // Vérifier si c'est un achat vérifié
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId: parseInt(productId),
        order: {
          userId: parseInt(userId),
          status: 'delivered'
        }
      }
    });

    const review = await prisma.productReview.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        rating,
        title,
        comment,
        isVerifiedPurchase: !!hasOrdered,
        isApproved: true // Auto-approuver pour l'instant
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      }
    });

    return review;
  }

  // Obtenir les avis d'un produit
  async getProductReviews(productId, filters = {}) {
    const { page = 1, limit = 10, rating, sortBy = 'createdAt' } = filters;
    const skip = (page - 1) * limit;

    const where = {
      productId: parseInt(productId),
      isApproved: true
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    const [reviews, total, stats] = await Promise.all([
      prisma.productReview.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: sortBy === 'helpful' 
          ? { helpfulCount: 'desc' }
          : { [sortBy]: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.productReview.count({ where }),
      prisma.productReview.aggregate({
        where: { productId: parseInt(productId), isApproved: true },
        _avg: { rating: true },
        _count: { rating: true }
      })
    ]);

    // Distribution des notes
    const ratingDistribution = await prisma.productReview.groupBy({
      by: ['rating'],
      where: { productId: parseInt(productId), isApproved: true },
      _count: { rating: true }
    });

    return {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
        distribution: ratingDistribution.reduce((acc, item) => {
          acc[item.rating] = item._count.rating;
          return acc;
        }, {})
      }
    };
  }

  // Marquer un avis comme utile
  async markReviewHelpful(userId, reviewId) {
    // Vérifier si l'avis existe
    const review = await prisma.productReview.findUnique({
      where: { id: parseInt(reviewId) }
    });

    if (!review) {
      throw new Error('Avis non trouvé');
    }

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await prisma.reviewHelpful.findUnique({
      where: {
        userId_reviewId: {
          userId: parseInt(userId),
          reviewId: parseInt(reviewId)
        }
      }
    });

    if (existingVote) {
      // Supprimer le vote
      await prisma.$transaction([
        prisma.reviewHelpful.delete({
          where: {
            userId_reviewId: {
              userId: parseInt(userId),
              reviewId: parseInt(reviewId)
            }
          }
        }),
        prisma.productReview.update({
          where: { id: parseInt(reviewId) },
          data: { helpfulCount: { decrement: 1 } }
        })
      ]);

      return { message: 'Vote retiré', helpful: false };
    } else {
      // Ajouter le vote
      await prisma.$transaction([
        prisma.reviewHelpful.create({
          data: {
            userId: parseInt(userId),
            reviewId: parseInt(reviewId)
          }
        }),
        prisma.productReview.update({
          where: { id: parseInt(reviewId) },
          data: { helpfulCount: { increment: 1 } }
        })
      ]);

      return { message: 'Avis marqué comme utile', helpful: true };
    }
  }

  // Supprimer son propre avis
  async deleteReview(userId, reviewId) {
    const review = await prisma.productReview.findFirst({
      where: {
        id: parseInt(reviewId),
        userId: parseInt(userId)
      }
    });

    if (!review) {
      throw new Error('Avis non trouvé');
    }

    await prisma.productReview.delete({
      where: { id: parseInt(reviewId) }
    });

    return { message: 'Avis supprimé avec succès' };
  }
}

module.exports = new ReviewService();
