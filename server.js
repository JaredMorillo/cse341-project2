const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
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
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS']}))
app.use(cors({origin: '*',}))
app.use('/', require('./routes/index'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
},
function(accessToken, refreshToken, profile, done) {
    // This function is called after GitHub authentication
    // You can save the user profile to your database here
    //User.findOrCreate({ githubId: profile.id }, function (err, user) {  
    return done(null, profile);
    // });
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out!!" )});

app.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect('/');
  });

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } 
  else {
    app.listen(port, () => {console.log(`Database is listening!, node is running too!! ${port}`);});
    }
});
