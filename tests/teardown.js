<<<<<<< HEAD
module.exports = async () => {
  try {
    const { closePool } = require('../src/connection');
    await closePool();
  } catch (error) {
    console.error('Falha ao encerrar pool nos testes:', error.message);
  }
};
=======
module.exports = async () => {
  try {
    const { closePool } = require('../src/connection');
    await closePool();
  } catch (error) {
    console.error('Falha ao encerrar pool nos testes:', error.message);
  }
};
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
