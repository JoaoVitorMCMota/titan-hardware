import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

import swaggerSpec from './docs/swagger.js';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
// 1. ADICIONADO: Importa as novas rotas de gerenciamento de usuários
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares Globais (Sempre no topo para processar toda e qualquer requisição)
app.use(express.json());
app.use(cors()); // Movido para cima para cobrir todas as rotas corretamente

// Servir arquivos estáticos da pasta upload
app.use('/upload', express.static(path.join(__dirname, '../upload')));

app.get('/', (req, res) => {
  res.json({
    message: 'Titan Hardware API'
  });
});

// Rotas da Aplicação
app.use('/produtos', productRoutes);
app.use('/categorias', categoryRoutes);
app.use('/auth', authRoutes);
//rota para o carrinho
app.use("/carrinho", cartRoutes);

// 2. ADICIONADO: Registra o endpoint público /usuarios mapeado para o CRUD
app.use('/usuarios', userRoutes);

// Documentação da API (Swagger UI)
app.use('/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export default app;
