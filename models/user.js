'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      accessToken: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      identification: DataTypes.INTEGER,
      email: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function(models) {
          User.hasMany(models.Task);
        },
      },
    }
  );

  return User;
};
