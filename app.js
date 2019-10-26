var express = require('express'),
  session = require('express-session'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  // db = require('./models'),
  ensureAuthenticated = require('./libs/ensureAuthenticated'),
  passport = require('passport'),
  Auth0Strategy = require('passport-auth0'),
  dotenv = require('dotenv'),
  db = require('./models'),
  admins = require('./config/admins.json'),
  moment = require('moment');

moment.locale('nb');

dotenv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/auth/callback',
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      const userEmail = profile.email || profile.emails[0].value;
      const users = await db.User.findOrCreate({
        where: {
          email: userEmail,
        },
        defaults: {
          email: userEmail,
        },
      });
      const { id, email } = users[0];
      const isAdmin = admins.indexOf(id) !== -1;
      return done(null, { email, id, isAdmin });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION || 'nothin' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.moment = moment;
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});


app.get(
  '/auth',
  passport.authenticate('auth0', {
    scope: 'openid profile email',
  })
);

app.get('/auth/callback', function(req, res, next) {
  passport.authenticate('auth0', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/auth');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/');
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
  res.redirect(logoutURL);
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
