const contactService = require('../services/contact.service');

class ContactController {
  async sendMessage(req, res, next) {
    try {
      const userId = req.user?.id;
      const message = await contactService.sendMessage({
        ...req.body,
        userId
      });
      res.status(201).json({
        message: 'Message envoyé avec succès',
        data: message
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const result = await contactService.getMessages(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMessage(req, res, next) {
    try {
      const { id } = req.params;
      const message = await contactService.getMessage(id);
      res.json(message);
    } catch (error) {
      next(error);
    }
  }

  async respondToMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { response } = req.body;
      const message = await contactService.respondToMessage(id, response);
      res.json({
        message: 'Réponse envoyée avec succès',
        data: message
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const result = await contactService.markAsRead(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactController();
