"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
if (env !== 'production') {
  var config    = require(__dirname + '/../config/config.json')[env];
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
} else {
  var sequelize = new Sequelize(process.env.DATABASE_URL, {});
}
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

// Define relationships.
db['Quote'].belongsTo(db['User']);
db['User'].hasMany(db['Quote']);
db['Vote'].belongsTo(db['User']);
db['Vote'].belongsTo(db['Quote']);
db['User'].hasMany(db['Vote']);
db['Quote'].hasMany(db['Vote']);

sequelize.sync().then(function(){
  console.log('I am Synchronized, sir.');

  // db.Quote.create({
  //   userId: 1,
  //   quote: 'Et bransjetreff uten idioter.',
  //   who: 'Simen A. W. Olsen'
  // })
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
