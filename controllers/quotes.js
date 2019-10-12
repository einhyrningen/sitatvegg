var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {
  app.get('/quote/:id/destroy', ensureAuthenticated, function(req, res, next) {
    if (req.user.isAdmin) {
      db.Quote.findById(req.params.id).then(function(quote) {
        quote.destroy().then(function() {
          res.redirect('/');
        });
      });
    }
  });
};
