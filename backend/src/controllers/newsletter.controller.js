const newsletterService = require('../services/newsletter.service');

class NewsletterController {
  async subscribe(req, res, next) {
    try {
      const { email } = req.body;
      const result = await newsletterService.subscribe(email);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async unsubscribe(req, res, next) {
    try {
      const { token } = req.params;
      const result = await newsletterService.unsubscribe(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSubscribers(req, res, next) {
    try {
      const result = await newsletterService.getSubscribers(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NewsletterController();
