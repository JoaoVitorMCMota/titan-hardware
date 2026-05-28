import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './docs/swagger.js';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
// 1. ADICIONADO: Importa as novas rotas de gerenciamento de usuários
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middlewares Globais (Sempre no topo para processar toda e qualquer requisição)
app.use(express.json());
app.use(cors()); // Movido para cima para cobrir todas as rotas corretamente

app.get('/', (req, res) => {
  res.json({
    message: 'Titan Hardware API'
  });
});

// Rotas da Aplicação
app.use('/produtos', productRoutes);
app.use('/categorias', categoryRoutes);
app.use('/auth', authRoutes);

// 2. ADICIONADO: Registra o endpoint público /usuarios mapeado para o CRUD
app.use('/usuarios', userRoutes);

// Documentação da API (Swagger UI)
app.use('/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export default app;