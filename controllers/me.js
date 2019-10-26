var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {
  app.get('/me', ensureAuthenticated, function(req, res, next) {
    res.json(req.user);
  });
};
