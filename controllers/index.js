var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {

	app.get('/', function(req, res, next) {
		db.Quote.findAll({
			order: 'id DESC',
			include: [ db.User ]
		})
		.then(function(quotes) {
			res.render('index', {
				quotes: quotes
			});
		});
	});

};