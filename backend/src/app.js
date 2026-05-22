const express = require('express');

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

module.exports = app;