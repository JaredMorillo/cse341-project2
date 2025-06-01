const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Contacts API',
        description: 'API for managing contacts',
    },
    host: 'localhost:3000',
    schemes: ['https','http'],
}; 

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server'); // Start the server after generating the documentation
});