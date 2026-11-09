const request = require('supertest');

async function loginAsTeacher(app) {
  const response = await request(app).post('/login').send({
    email: process.env.AUTH_EMAIL || 'professor@educatech.com',
    senha: process.env.AUTH_PASSWORD || 'educatech123',
  });

  if (response.status !== 200 || !response.body.token) {
    throw new Error(`Falha ao autenticar nos testes: ${JSON.stringify(response.body)}`);
  }

  return { Authorization: `Bearer ${response.body.token}` };
}

module.exports = { loginAsTeacher };
