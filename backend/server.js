const app = require('./src/app');

const connectDatabase = require('./src/config/database');

connectDatabase();

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});