const prisma = require('../lib/prisma');

class ProductService {
  // Obtenir tous les produits avec filtres
  async getProducts(filters = {}) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      isNew,
      isBestseller,
      onSale,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const skip = (currentPage - 1) * perPage;

    const where = { isActive: true };

    if (categoryId) where.categoryId = parseInt(categoryId);
    if (brandId) where.brandId = parseInt(brandId);
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    if (isNew !== undefined) where.isNew = isNew === 'true';
    if (isBestseller !== undefined) where.isBestseller = isBestseller === 'true';

    const andConditions = [];

    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      andConditions.push({ price: priceFilter });
    }

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    if (onSale === 'true') {
      andConditions.push({
        OR: [
          { discountPercentage: { gt: 0 } },
          { oldPrice: { not: null } }
        ]
      });
    }

    if (andConditions.length) {
      where.AND = andConditions;
    }

    const allowedSortFields = ['createdAt', 'price', 'viewCount', 'name', 'stockQuantity'];
    const normalizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const normalizedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 1
          },
          _count: {
            select: { reviews: true }
          }
        },
        orderBy: { [normalizedSortBy]: normalizedSortOrder },
        skip,
        take: perPage
      }),
      prisma.product.count({ where })
    ]);

    // Calculer la note moyenne pour chaque produit
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const avgRating = await prisma.productReview.aggregate({
          where: { productId: product.id, isApproved: true },
          _avg: { rating: true }
        });

        return {
          ...product,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: product._count.reviews
        };
      })
    );

    return {
      products: productsWithRating,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        pages: Math.ceil(total / perPage)
      }
    };
  }

  // Obtenir un produit par son slug ou ID
  async getProductBySlug(slugOrId) {
    // Vérifier si c'est un ID numérique
    const isNumericId = /^\d+$/.test(slugOrId);
    
    const product = await prisma.product.findFirst({
      where: isNumericId 
        ? { id: parseInt(slugOrId), isActive: true }
        : { slug: slugOrId, isActive: true },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { where: { isActive: true } },
        features: { orderBy: { displayOrder: 'asc' } },
        tags: {
          include: {
            tag: true
          }
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarUrl: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    // Incrémenter le compteur de vues
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    });

    // Calculer les statistiques des avis
    const reviewStats = await prisma.productReview.aggregate({
      where: { productId: product.id, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const ratingDistribution = await prisma.$queryRaw`
      SELECT rating, COUNT(*)::int as count
      FROM product_reviews
      WHERE product_id = ${product.id} AND is_approved = true
      GROUP BY rating
      ORDER BY rating DESC
    `;

    return {
      ...product,
      averageRating: reviewStats._avg.rating || 0,
      reviewCount: reviewStats._count.rating,
      ratingDistribution
    };
  }

  // Créer un nouveau produit (Admin)
  async createProduct(productData) {
    const { images, features, tags, ...mainData } = productData;

    const product = await prisma.product.create({
      data: {
        ...mainData,
        images: images ? {
          create: images.map((img, index) => ({
            imageUrl: img.url,
            altText: img.alt || mainData.name,
            displayOrder: index,
            isPrimary: index === 0
          }))
        } : undefined,
        features: features ? {
          create: features.map((feat, index) => ({
            featureName: feat.name,
            featureValue: feat.value,
            displayOrder: index
          }))
        } : undefined
      },
      include: {
        category: true,
        brand: true,
        images: true
      }
    });

    return product;
  }

  // Mettre à jour un produit (Admin)
  async updateProduct(id, updateData) {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
        brand: true,
        images: true
      }
    });

    return product;
  }

  // Supprimer un produit (Admin - soft delete)
  async deleteProduct(id) {
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });

    return { message: 'Produit supprimé avec succès' };
  }

  // Obtenir les produits liés
  async getRelatedProducts(productId, limit = 6) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: { categoryId: true, brandId: true }
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: true },
          { id: { not: parseInt(productId) } },
          {
            OR: [
              { categoryId: product.categoryId },
              { brandId: product.brandId }
            ]
          }
        ]
      },
      include: {
        images: { take: 1, orderBy: { displayOrder: 'asc' } }
      },
      take: limit
    });

    return relatedProducts;
  }
}

module.exports = new ProductService();
