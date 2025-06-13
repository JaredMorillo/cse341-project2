const passport = require('passport');

const router = require('express').Router();
router.use('/', require('./swagger'));
router.use('/contacts', require('./contacts'));
router.use('/products', require('./products'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next)  {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}); 

module.exports = router;