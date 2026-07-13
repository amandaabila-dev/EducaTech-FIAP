module.exports = async () => {
  try {
    const { closePool } = require('../src/connection');
    await closePool();
  } catch (error) {
    console.error('Falha ao encerrar pool nos testes:', error.message);
  }
};
