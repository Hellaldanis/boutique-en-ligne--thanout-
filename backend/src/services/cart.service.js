const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class CartService {
  // Obtenir ou créer un panier
  async getOrCreateCart(userId, sessionId = null) {
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId: parseInt(userId) } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1, orderBy: { displayOrder: 'asc' } }
              }
            },
            variant: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId: parseInt(userId) } : { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1, orderBy: { displayOrder: 'asc' } }
                }
              },
              variant: true
            }
          }
        }
      });
    }

    // Calculer le total
    const total = cart.items.reduce((sum, item) => {
      const price = item.variant 
        ? parseFloat(item.product.price) + parseFloat(item.variant.priceAdjustment)
        : parseFloat(item.product.price);
      return sum + (price * item.quantity);
    }, 0);

    return {
      ...cart,
      itemCount: cart.items.length,
      total
    };
  }

  // Ajouter un article au panier
  async addItem(userId, sessionId, { productId, variantId, quantity = 1 }) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    // Vérifier le produit
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product || !product.isActive) {
      throw new Error('Produit non disponible');
    }

    // Vérifier la variante si spécifiée
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: parseInt(variantId) }
      });

      if (!variant || !variant.isActive) {
        throw new Error('Variante non disponible');
      }

      if (variant.stockQuantity < quantity) {
        throw new Error('Stock insuffisant pour cette variante');
      }
    } else if (product.stockQuantity < quantity) {
      throw new Error('Stock insuffisant');
    }

    // Vérifier si l'article existe déjà
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId),
        variantId: variantId ? parseInt(variantId) : null
      }
    });

    if (existingItem) {
      // Mettre à jour la quantité
      const newQuantity = existingItem.quantity + quantity;
      const availableStock = variantId 
        ? (await prisma.productVariant.findUnique({ where: { id: parseInt(variantId) } })).stockQuantity
        : product.stockQuantity;

      if (newQuantity > availableStock) {
        throw new Error('Quantité demandée supérieure au stock disponible');
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Ajouter un nouvel article
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          variantId: variantId ? parseInt(variantId) : null,
          quantity
        }
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  // Mettre à jour la quantité d'un article
  async updateItem(userId, sessionId, itemId, quantity) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await prisma.cartItem.findFirst({
      where: {
        id: parseInt(itemId),
        cartId: cart.id
      },
      include: {
        product: true,
        variant: true
      }
    });

    if (!item) {
      throw new Error('Article non trouvé dans le panier');
    }

    // Vérifier le stock
    const availableStock = item.variant 
      ? item.variant.stockQuantity
      : item.product.stockQuantity;

    if (quantity > availableStock) {
      throw new Error('Quantité demandée supérieure au stock disponible');
    }

    if (quantity <= 0) {
      // Supprimer l'article si la quantité est 0
      await prisma.cartItem.delete({
        where: { id: parseInt(itemId) }
      });
    } else {
      await prisma.cartItem.update({
        where: { id: parseInt(itemId) },
        data: { quantity }
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  // Supprimer un article du panier
  async removeItem(userId, sessionId, itemId) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    await prisma.cartItem.deleteMany({
      where: {
        id: parseInt(itemId),
        cartId: cart.id
      }
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  // Vider le panier
  async clearCart(userId, sessionId) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  // Fusionner les paniers (lors de la connexion)
  async mergeCarts(userId, sessionId) {
    const [userCart, sessionCart] = await Promise.all([
      prisma.cart.findUnique({
        where: { userId: parseInt(userId) },
        include: { items: true }
      }),
      prisma.cart.findFirst({
        where: { sessionId },
        include: { items: true }
      })
    ]);

    if (!sessionCart || sessionCart.items.length === 0) {
      return userCart;
    }

    // Fusionner les articles
    for (const item of sessionCart.items) {
      const existingItem = userCart?.items.find(
        i => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity }
        });
      } else {
        if (!userCart) {
          // Créer le panier utilisateur si nécessaire
          const newCart = await prisma.cart.create({
            data: { userId: parseInt(userId) }
          });
          await prisma.cartItem.create({
            data: {
              cartId: newCart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity
            }
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity
            }
          });
        }
      }
    }

    // Supprimer le panier de session
    await prisma.cart.delete({
      where: { id: sessionCart.id }
    });

    return this.getOrCreateCart(userId, null);
  }
}

module.exports = new CartService();
