const prisma = require('../lib/prisma');

class OrderService {
  // Créer une commande
  async createOrder(userId, orderData) {
    const { items, paymentMethod, shippingAddress, promoCode, notes } = orderData;

    // Générer un numéro de commande unique
    const orderNumber = `THN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculer le sous-total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) },
        include: {
          variants: item.variantId ? {
            where: { id: parseInt(item.variantId) }
          } : false
        }
      });

      if (!product || !product.isActive) {
        throw new Error(`Produit ${item.productId} non disponible`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`);
      }

      const variant = item.variantId ? product.variants[0] : null;
      const unitPrice = variant ? product.price + variant.priceAdjustment : product.price;
      const itemSubtotal = unitPrice * item.quantity;

      subtotal += parseFloat(itemSubtotal);

      orderItems.push({
        productId: product.id,
        variantId: variant?.id,
        productName: product.name,
        productSku: product.sku,
        variantDetails: variant ? JSON.stringify({
          type: variant.variantType,
          value: variant.variantValue
        }) : null,
        unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        discountAmount: 0,
        totalAmount: itemSubtotal
      });
    }

    // Calculer les frais de livraison
    let shippingCost = 500; // 500 DA par défaut
    if (subtotal >= 5000) shippingCost = 0; // Livraison gratuite au-dessus de 5000 DA

    // Appliquer le code promo
    let discountAmount = 0;
    let promoCodeId = null;

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode, isActive: true }
      });

      if (promo) {
        const now = new Date();
        if (now >= promo.validFrom && now <= promo.validUntil) {
          if (!promo.usageLimit || promo.usageCount < promo.usageLimit) {
            // Vérifier l'utilisation par utilisateur
            const userUsageCount = await prisma.promoCodeUsage.count({
              where: {
                promoId: promo.id,
                userId: parseInt(userId)
              }
            });

            if (userUsageCount < promo.usagePerUser) {
              if (subtotal >= parseFloat(promo.minPurchaseAmount)) {
                promoCodeId = promo.id;

                if (promo.discountType === 'percentage') {
                  discountAmount = (subtotal * parseFloat(promo.discountValue)) / 100;
                  if (promo.maxDiscountAmount) {
                    discountAmount = Math.min(discountAmount, parseFloat(promo.maxDiscountAmount));
                  }
                } else if (promo.discountType === 'fixed') {
                  discountAmount = parseFloat(promo.discountValue);
                } else if (promo.discountType === 'free_shipping') {
                  shippingCost = 0;
                }
              }
            }
          }
        }
      }
    }

    const totalAmount = subtotal + shippingCost - discountAmount;

    // Créer la commande avec transaction
    const order = await prisma.$transaction(async (tx) => {
      // Créer la commande
      const newOrder = await tx.order.create({
        data: {
          userId: parseInt(userId),
          orderNumber,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod,
          subtotal,
          shippingCost,
          discountAmount,
          totalAmount,
          promoCodeId,
          notes,
          ipAddress: orderData.ipAddress,
          userAgent: orderData.userAgent,
          items: {
            create: orderItems
          },
          shipping: {
            create: shippingAddress
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1 }
                }
              }
            }
          },
          shipping: true
        }
      });

      // Mettre à jour le stock des produits
      for (const item of items) {
        await tx.product.update({
          where: { id: parseInt(item.productId) },
          data: {
            stockQuantity: { decrement: item.quantity }
          }
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: parseInt(item.variantId) },
            data: {
              stockQuantity: { decrement: item.quantity }
            }
          });
        }
      }

      // Enregistrer l'utilisation du code promo
      if (promoCodeId) {
        await tx.promoCodeUsage.create({
          data: {
            promoId: promoCodeId,
            userId: parseInt(userId),
            orderId: newOrder.id
          }
        });

        await tx.promoCode.update({
          where: { id: promoCodeId },
          data: { usageCount: { increment: 1 } }
        });
      }

      // Vider le panier de l'utilisateur
      const cart = await tx.cart.findUnique({
        where: { userId: parseInt(userId) }
      });

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      return newOrder;
    });

    return order;
  }

  // Obtenir les commandes d'un utilisateur
  async getUserOrders(userId, filters = {}) {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where = { userId: parseInt(userId) };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1 }
                }
              }
            }
          },
          shipping: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Obtenir une commande spécifique
  async getOrder(orderId, userId) {
    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(orderId),
        userId: parseInt(userId)
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 }
              }
            },
            variant: true
          }
        },
        shipping: true,
        promoCode: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    return order;
  }

  // Annuler une commande
  async cancelOrder(orderId, userId, reason) {
    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(orderId),
        userId: parseInt(userId)
      },
      include: {
        items: true
      }
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new Error('Cette commande ne peut pas être annulée');
    }

    // Annuler la commande et restaurer le stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restaurer le stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity }
          }
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: { increment: item.quantity }
            }
          });
        }
      }

      // Mettre à jour la commande
      const updated = await tx.order.update({
        where: { id: parseInt(orderId) },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason
        }
      });

      // Enregistrer l'historique
      await tx.orderStatusHistory.create({
        data: {
          orderId: parseInt(orderId),
          oldStatus: order.status,
          newStatus: 'cancelled',
          notes: reason
        }
      });

      return updated;
    });

    return updatedOrder;
  }

  // Valider un code promo
  async validatePromoCode(code, userId, cartTotal) {
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase(), isActive: true }
    });

    if (!promo) {
      throw new Error('Code promo invalide');
    }

    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      throw new Error('Code promo expiré');
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      throw new Error('Ce code promo a atteint sa limite d\'utilisation');
    }

    // Vérifier l'utilisation par utilisateur
    const userUsageCount = await prisma.promoCodeUsage.count({
      where: {
        promoId: promo.id,
        userId: parseInt(userId)
      }
    });

    if (userUsageCount >= promo.usagePerUser) {
      throw new Error('Vous avez déjà utilisé ce code promo');
    }

    if (cartTotal < parseFloat(promo.minPurchaseAmount)) {
      throw new Error(`Montant minimum requis: ${promo.minPurchaseAmount} DA`);
    }

    // Calculer la réduction
    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = (cartTotal * parseFloat(promo.discountValue)) / 100;
      if (promo.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, parseFloat(promo.maxDiscountAmount));
      }
    } else if (promo.discountType === 'fixed') {
      discountAmount = parseFloat(promo.discountValue);
    }

    return {
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: parseFloat(promo.discountValue),
      discountAmount,
      freeShipping: promo.discountType === 'free_shipping'
    };
  }
}

module.exports = new OrderService();
