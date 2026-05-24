const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Titan Hardware API'
  });
});

app.use('/produtos', productRoutes);

app.use('/categorias', categoryRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
module.exports = app;