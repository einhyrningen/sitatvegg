var express = require('express'),
  session = require('express-session');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var fs = require('fs');
var db = require('./models');
var ensureAuthenticated = require('./libs/ensureAuthenticated');

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  facebookConfig = require('./config/facebook.json');

if (process.env.FACEBOOK_CLIENT_SECRET) {
  facebookConfig.clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.use(
  new FacebookStrategy(facebookConfig, function(
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    console.log(profile.displayName + ' (' + profile.id + ') logged on!');
    db.User.findOrCreate({
      where: {
        identification: profile.id,
      },
      defaults: {
        displayName: profile.displayName,
        accessToken: accessToken,
        refreshToken: refreshToken,
        identification: profile.id,
      },
    }).then(
      function(user) {
        user = user[0];
        user
          .update({
            accessToken: accessToken,
            refreshToken: refreshToken,
          })
          .then(function() {
            done(null, user);
          });
      },
      function(err) {
        return done(err);
      }
    );
  })
);

passport.serializeUser(function(user, done) {
  done(null, {
    _id: user.id,
    displayName: user.displayName,
    identification: user.identification,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  });
});

passport.deserializeUser(function(user, done) {
  // The sessionUser object is different from the user mongoose collection
  // it's actually req.session.passport.user and comes from the session collection
  done(null, user);
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION || 'nothin' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
// app.use(expressValidator());
app.use(function(req, res, next) {
  if (req.facebookAdmins == undefined) {
    require('./libs/getFacebookAdmins')(function(facebookAdmins) {
      req.facebookAdmins = facebookAdmins;
      console.log(facebookAdmins);
      next();
    });
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = {
      authenticated: true,
      profile: req.user,
      isAdmin: req.facebookAdmins.indexOf(req.user.identification) !== -1,
    };

    req.user.isAdmin = res.locals.user.isAdmin;

    next();
  } else {
    res.locals.user = {
      authenticated: false,
      profile: {},
      isAdmin: false,
    };

    next();
  }
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var router = express.Router(); // get an instance of the express Router
// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function(file) {
  if (file.substr(-3) == '.js') {
    route = require('./controllers/' + file);
    route.controller(app, ensureAuthenticated);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
