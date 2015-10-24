var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {

	app.get('/', function(req, res, next) {
		db.Quote.findAll({
			order: 'numVotes DESC',
			order: 'createdAt DESC',
			group: [
				'Quote.id'
			],
			include: [ db.User, db.Vote ], 
			attributes: { include: [[db.sequelize.fn('COUNT', db.sequelize.col('Votes.QuoteId')), 'numVotes']] }
		})
		.then(function(quotes) {
			res.render('index', {
				quotes: quotes
			});
		});
	});

};