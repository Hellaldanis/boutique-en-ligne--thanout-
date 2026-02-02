const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

class NewsletterService {
  // S'abonner à la newsletter
  async subscribe(email) {
    // Vérifier si l'email existe déjà
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.isSubscribed) {
        throw new Error('Cet email est déjà abonné à la newsletter');
      } else {
        // Réabonner
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isSubscribed: true,
            unsubscribedAt: null
          }
        });
        return { message: 'Réabonnement à la newsletter réussi' };
      }
    }

    // Créer un nouvel abonné
    const token = crypto.randomBytes(32).toString('hex');
    
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        subscriptionToken: token,
        isSubscribed: true
      }
    });

    // TODO: Envoyer email de confirmation

    return { message: 'Abonnement à la newsletter réussi' };
  }

  // Se désabonner
  async unsubscribe(token) {
    const subscriber = await prisma.newsletterSubscriber.findFirst({
      where: { subscriptionToken: token }
    });

    if (!subscriber) {
      throw new Error('Token invalide');
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        isSubscribed: false,
        unsubscribedAt: new Date()
      }
    });

    return { message: 'Désabonnement réussi' };
  }

  // Obtenir tous les abonnés (Admin)
  async getSubscribers(filters = {}) {
    const { page = 1, limit = 50, isSubscribed } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (isSubscribed !== undefined) {
      where.isSubscribed = isSubscribed === 'true';
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.newsletterSubscriber.count({ where })
    ]);

    return {
      subscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new NewsletterService();
