var FB = require('fb'),
  facebookConfig = require('../config/facebook.json'),
  async = require('async');

module.exports = function(adminsCallback) {
  var admins = [];

  FB.setAccessToken(
    facebookConfig.clientID + '|' + facebookConfig.clientSecret
  );

  FB.api(facebookConfig.clientID + '/roles', function(res) {
    async.each(
      res.data,
      function(admin, callback) {
        if (admin.role == 'administrators') {
          admins.push(parseInt(admin.user));
        }
        callback();
      },
      function done() {
        adminsCallback(admins);
      }
    );
  });
};
