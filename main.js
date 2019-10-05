require('dotenv').config()
// Mongoose modules
const mongoose = require('mongoose')
// Express modules
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
// Passport modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Other modules
const path = require('path');

// Models
const User = require('./models/user')

// Initialize Database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', (err) => {
  throw (err);
});
db.once('open', function() {
  console.log("Mongoose connected!");
});

// Passport Local
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {
          message: 'Unknown User'
        });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// Express Init
app.use(require('morgan')('combined'));
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Templating
app.set('view engine', 'ejs');

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Bootstrap
app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));

// Locals
app.locals.instance = process.env.URL;

// Express Routes
// Home
app.get('/', (req, res) => {
  res.render('pages/index.ejs', {
    user: req.user
  })
});

// External Routes
const authRoutes = require('./routes/auth');
app.use(authRoutes);

// Express listening
app.listen(port, () => console.log('App listening on port ' + port));
