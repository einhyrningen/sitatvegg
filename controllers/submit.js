var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {
  app.get('/submit', ensureAuthenticated, function(req, res, next) {
    res.render('submit');
  });

  app.post('/submit', ensureAuthenticated, function(req, res, next) {
    // TODO: Add validation back in.
    // req.checkBody('quote', 'Mangler sitatet.').notEmpty();
    // req.checkBody('who', 'Mangler navnet på vedkommende sa dette.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.render('error', {
        message: 'En feil oppsto!',
        error: {
          stack: errors[0].msg,
        },
      });
      return;
    }

    db.User.findById(req.user._id).then(function(user) {
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
