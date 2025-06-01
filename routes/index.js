const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) =>
    //#swagger.tags = ['Home'] 
    { res.send('Welcome to the home page!'); });

router.use('/contacts', require('./contacts'));

module.exports = router;