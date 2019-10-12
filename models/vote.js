'use strict';

module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define(
    'Vote',
    {},
    {
      paranoid: true,
    }
  );

  return Vote;
};
