const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

//CORS configuration
app.use(cors({origin: '*',}))
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS']}))

//Body parser configuration
app.use(bodyParser.json());

// Express session configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));
// Passport configuration
app.use(passport.initialize());
// Passport session setup
app.use(passport.session());
// Passport GitHub strategy
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods', 
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods', 
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
})


// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//Routes
app.use('/', require('./routes/index'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// GitHub callback
app.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect('/');
  });

// Logout route
app.get('/', (req, res) => {
  res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : "Logged out!!");
});

 
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } 
  else {
    app.listen(port, () => {console.log(`🚀 Server running on port ${port}`);});
    }
});
