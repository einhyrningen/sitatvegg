var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {
  app.get('/vote/:id', ensureAuthenticated, function(req, res, next) {
    db.Quote.findByPk(req.params.id).then(function(quote) {
      db.Vote.find({
        where: {
          userId: req.user._id,
          quoteId: quote.id,
        },
      }).then(function(Vote) {
        if (Vote) {
          console.log('Vote was found.');
          res.redirect('/');
        } else {
          console.log('Vote was not found. Creating.');
          db.Vote.create({
            userId: req.user._id,
            quoteId: quote.id,
          }).then(function() {
            console.log('Created.');
            res.redirect('/');
          });
        }
      });
    });
  });
};
