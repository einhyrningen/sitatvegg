"use strict";

module.exports = function(sequelize, DataTypes) {
  var Quote = sequelize.define("Quote", {
    quote: DataTypes.STRING,
    who: DataTypes.STRING
  }, {
  	paranoid: true
  });

  return Quote;
};
