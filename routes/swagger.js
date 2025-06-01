const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');  
const swaggerDocument = require('../swagger.json');

// This file sets up the Swagger UI for API documentation.
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;