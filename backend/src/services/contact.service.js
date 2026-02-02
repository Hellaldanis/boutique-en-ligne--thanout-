const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ContactService {
  // Envoyer un message de contact
  async sendMessage(messageData) {
    const { name, email, subject, message, userId } = messageData;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        userId: userId ? parseInt(userId) : null,
        status: 'new'
      }
    });

    // TODO: Envoyer notification par email à l'admin

    return contactMessage;
  }

  // Obtenir tous les messages (Admin)
  async getMessages(filters = {}) {
    const { page = 1, limit = 20, status } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.contactMessage.count({ where })
    ]);

    return {
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Obtenir un message spécifique (Admin)
  async getMessage(id) {
    const message = await prisma.contactMessage.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!message) {
      throw new Error('Message non trouvé');
    }

    return message;
  }

  // Répondre à un message (Admin)
  async respondToMessage(id, response) {
    const message = await prisma.contactMessage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!message) {
      throw new Error('Message non trouvé');
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: {
        status: 'responded',
        adminResponse: response,
        respondedAt: new Date()
      }
    });

    // TODO: Envoyer email de réponse au client

    return updatedMessage;
  }

  // Marquer comme lu (Admin)
  async markAsRead(id) {
    await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { status: 'read' }
    });

    return { message: 'Message marqué comme lu' };
  }
}

module.exports = new ContactService();
