const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Titan Hardware API',
      version: '1.0.0',
      description: 'API da loja Titan Hardware'
    },

    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },

  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;