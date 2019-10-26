var db = require('../models');
var Joi = require('@hapi/joi');

module.exports.controller = function(app, ensureAuthenticated) {
  app.get('/submit', ensureAuthenticated, function(req, res, next) {
    res.render('submit');
  });

  app.post('/submit', ensureAuthenticated, function(req, res, next) {
    const schema = Joi.object({
      quote: Joi.string().required().error(new Error('Mangler sitatet.')),
      who: Joi.string().required().error(new Error('Mangler navnet på vedkommende som sa det.')),
    });

    const validation = schema.validate(req.body);
    
    if (validation.error) {
      res.render('error', {
        message: 'En feil oppsto!',
        error: {
          stack: validation.error,
        },
      });
      return;
    }

    db.User.findByPk(req.user.id).then(function(user) {
      db.Quote.create({
        quote: req.body.quote,
        who: req.body.who,
      }).then(function(Quote) {
        user.addQuote(Quote).then(function(QuoteResult) {
          res.redirect('/');
        });
      });
    });
  });
};
