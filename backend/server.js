import 'dotenv/config.js';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

// Conectar ao MongoDB
await connectDatabase();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando http://localhost:${PORT}`);
});
