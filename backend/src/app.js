import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './docs/swagger.js';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Titan Hardware API'
  });
});
app.use(cors());

app.use('/produtos', productRoutes);

app.use('/categorias', categoryRoutes);

app.use('/auth', authRoutes);

app.use('/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export default app;