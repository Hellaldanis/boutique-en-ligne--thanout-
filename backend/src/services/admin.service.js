const prisma = require('../lib/prisma');
const { logger } = require('../middlewares/errorHandler.middleware');

class AdminService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Total revenue
      const totalRevenue = await prisma.order.aggregate({
        where: { status: 'completed' },
        _sum: { totalAmount: true }
      });

      const lastMonthRevenue = await prisma.order.aggregate({
        where: {
          status: 'completed',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: { totalAmount: true }
      });

      const currentMonthRevenue = await prisma.order.aggregate({
        where: {
          status: 'completed',
          createdAt: { gte: startOfMonth }
        },
        _sum: { totalAmount: true }
      });

      // Orders count
      const totalOrders = await prisma.order.count();
      const lastMonthOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      });
      const currentMonthOrders = await prisma.order.count({
        where: { createdAt: { gte: startOfMonth } }
      });

      // Users count
      const totalUsers = await prisma.user.count();
      const lastMonthUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      });
      const currentMonthUsers = await prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
      });

      // Products count
      const totalProducts = await prisma.product.count();
      const lastMonthProducts = await prisma.product.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      });
      const currentMonthProducts = await prisma.product.count({
        where: { createdAt: { gte: startOfMonth } }
      });

      // Recent orders
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      });

      // Top products
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      });

      const topProductsWithDetails = (await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, price: true, images: true }
          });
          if (!product) return null;
          return {
            ...product,
            salesCount: item._sum.quantity,
            revenue: parseFloat(product.price) * item._sum.quantity
          };
        })
      )).filter(Boolean);

      // Calculate percentage changes
      const lastRev = parseFloat(lastMonthRevenue._sum.totalAmount) || 0;
      const currRev = parseFloat(currentMonthRevenue._sum.totalAmount) || 0;
      const revenueChange = lastRev
        ? ((currRev - lastRev) / lastRev) * 100
        : 0;

      const ordersChange = lastMonthOrders
        ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;

      const usersChange = lastMonthUsers
        ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
        : 0;

      const productsChange = lastMonthProducts
        ? ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100
        : 0;

      return {
        stats: {
          revenue: {
            total: totalRevenue._sum.totalAmount || 0,
            change: revenueChange
          },
          orders: {
            total: totalOrders,
            change: ordersChange
          },
          users: {
            total: totalUsers,
            change: usersChange
          },
          products: {
            total: totalProducts,
            change: productsChange
          }
        },
        recentOrders,
        topProducts: topProductsWithDetails
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // Get detailed statistics
  async getDetailedStats(period = '30d') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Revenue over time
      const revenueOverTime = await prisma.$queryRaw`
        SELECT DATE(created_at) as date, SUM(total_amount) as revenue
        FROM orders
        WHERE status = 'completed' AND created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      // User growth
      const userGrowth = await prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      // Category performance
      const categoryPerformance = await prisma.$queryRaw`
        SELECT c.name, COUNT(DISTINCT oi.order_id) as orders, SUM(oi.quantity) as items_sold, SUM(oi.subtotal) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'completed' AND o.created_at >= ${startDate}
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
      `;

      // Best selling products
      const bestSellers = await prisma.$queryRaw`
        SELECT p.id, p.name, p.price, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'completed' AND o.created_at >= ${startDate}
        GROUP BY p.id, p.name, p.price
        ORDER BY revenue DESC
        LIMIT 10
      `;

      return {
        period,
        revenueOverTime,
        userGrowth,
        categoryPerformance,
        bestSellers
      };
    } catch (error) {
      logger.error('Error getting detailed stats:', error);
      throw error;
    }
  }

  // Ban/Unban user
  async updateUserStatus(userId, accountSuspended, suspensionReason = null) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          accountSuspended,
          suspensionReason: accountSuspended ? suspensionReason : null
        }
      });

      logger.info(`User ${userId} ${accountSuspended ? 'banned' : 'unbanned'}`);
      return user;
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw error;
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      // Check if user is already an admin
      const existingAdmin = await prisma.adminUser.findFirst({
        where: { userId }
      });

      if (role === 'admin') {
        if (!existingAdmin) {
          // Create admin user entry
          await prisma.adminUser.create({
            data: {
              userId,
              role: 'admin',
              permissions: JSON.stringify(['all']),
              isActive: true
            }
          });
        }
      } else {
        if (existingAdmin) {
          // Remove admin privileges
          await prisma.adminUser.delete({
            where: { id: existingAdmin.id }
          });
        }
      }

      logger.info(`User ${userId} role updated to ${role}`);
      return { success: true };
    } catch (error) {
      logger.error('Error updating user role:', error);
      throw error;
    }
  }

  // Get all users with stats
  async getAllUsers(page = 1, limit = 50, search = '', filter = 'all') {
    try {
      const skip = (page - 1) * limit;
      let where = {};

      // Search filter
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Status filter
      if (filter === 'suspended') {
        where.accountSuspended = true;
      } else if (filter === 'active') {
        where.accountSuspended = false;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            adminUser: true,
            _count: {
              select: { orders: true }
            }
          }
        }),
        prisma.user.count({ where })
      ]);

      // Get total spent for each user
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const totalSpent = await prisma.order.aggregate({
            where: {
              userId: user.id,
              status: 'completed'
            },
            _sum: { totalAmount: true }
          });

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            isActive: user.isActive,
            accountSuspended: user.accountSuspended,
            suspensionReason: user.suspensionReason,
            isVerified: user.isVerified,
            role: user.adminUser ? 'admin' : 'customer',
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            ordersCount: user._count.orders,
            totalSpent: totalSpent._sum.totalAmount || 0
          };
        })
      );

      return {
        users: usersWithStats,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  // Promo code management
  async createPromoCode(data) {
    try {
      const promoCode = await prisma.promoCode.create({
        data: {
          code: data.code.toUpperCase(),
          description: data.description,
          discountType: data.discountType,
          discountValue: parseFloat(data.discountValue),
          minPurchaseAmount: data.minPurchaseAmount ? parseFloat(data.minPurchaseAmount) : 0,
          maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null,
          usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
          usagePerUser: data.usagePerUser ? parseInt(data.usagePerUser) : 1,
          validFrom: new Date(data.validFrom),
          validUntil: new Date(data.validUntil),
          isActive: data.isActive !== false
        }
      });

      logger.info(`Promo code ${promoCode.code} created`);
      return promoCode;
    } catch (error) {
      logger.error('Error creating promo code:', error);
      throw error;
    }
  }

  async updatePromoCode(id, data) {
    try {
      const updateData = {};
      
      if (data.code) updateData.code = data.code.toUpperCase();
      if (data.description !== undefined) updateData.description = data.description;
      if (data.discountType) updateData.discountType = data.discountType;
      if (data.discountValue !== undefined) updateData.discountValue = parseFloat(data.discountValue);
      if (data.minPurchaseAmount !== undefined) updateData.minPurchaseAmount = parseFloat(data.minPurchaseAmount);
      if (data.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null;
      if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit ? parseInt(data.usageLimit) : null;
      if (data.usagePerUser !== undefined) updateData.usagePerUser = parseInt(data.usagePerUser);
      if (data.validFrom) updateData.validFrom = new Date(data.validFrom);
      if (data.validUntil) updateData.validUntil = new Date(data.validUntil);
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const promoCode = await prisma.promoCode.update({
        where: { id },
        data: updateData
      });

      logger.info(`Promo code ${id} updated`);
      return promoCode;
    } catch (error) {
      logger.error('Error updating promo code:', error);
      throw error;
    }
  }

  async deletePromoCode(id) {
    try {
      await prisma.promoCode.delete({
        where: { id }
      });

      logger.info(`Promo code ${id} deleted`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting promo code:', error);
      throw error;
    }
  }

  async getAllPromoCodes() {
    try {
      const promoCodes = await prisma.promoCode.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { usages: true }
          }
        }
      });

      return promoCodes.map(code => ({
        ...code,
        usageCount: code._count.usages
      }));
    } catch (error) {
      logger.error('Error getting promo codes:', error);
      throw error;
    }
  }

  // Activity logging
  async logActivity(adminId, action, entityType, entityId, details = {}) {
    try {
      await prisma.activityLog.create({
        data: {
          adminId,
          action,
          entityType,
          entityId,
          details: JSON.stringify(details)
        }
      });
    } catch (error) {
      logger.error('Error logging activity:', error);
    }
  }

  async getActivityLogs(page = 1, limit = 50, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {};

      if (filters.adminId) where.adminId = filters.adminId;
      if (filters.action) where.action = filters.action;
      if (filters.entityType) where.entityType = filters.entityType;

      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, email: true }
                }
              }
            }
          }
        }),
        prisma.activityLog.count({ where })
      ]);

      return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting activity logs:', error);
      throw error;
    }
  }
}

module.exports = new AdminService();
