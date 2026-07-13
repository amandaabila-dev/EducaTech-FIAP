require('dotenv').config();

const app = require('./app');
const { initDatabase, closePool } = require('./connection');

const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`EducaTech FIAP API rodando na porta ${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(async (error) => {
    console.error('Falha ao iniciar a aplicação:', error);
    await closePool();
    process.exit(1);
  });

process.on('SIGTERM', () => closePool());
process.on('SIGINT', () => closePool());
