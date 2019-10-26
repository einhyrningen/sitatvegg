var db = require('../models');

module.exports.controller = function(app, ensureAuthenticated) {
  app.get('/', async (req, res) => {
    const quotes = await db.Quote.findAll({
      order: [
        ['createdAt', 'DESC'],
        [db.sequelize.literal('"numVotes"'), 'DESC'],
      ],
      // group: ['Quote.id', 'User.id'],
      include: [
        //   { model: db.User, required: true },
        // { model: db.Vote, required: false },
      ],
      attributes: [
        'id',
        'quote',
        'who',
        'createdAt',
        [
          db.sequelize.literal(
            '(SELECT COUNT(*) FROM "Votes" WHERE "Votes"."QuoteId" = "Quote"."id")'
          ),
          //   db.sequelize.fn('COUNT', db.sequelize.col('Votes.QuoteId')),
          'numVotes',
        ],
      ],
    });

    res.render('index', {
      quotes,
    });
  });
};
