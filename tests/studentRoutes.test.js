process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://educatech:educatech@localhost:5432/educatech';

const request = require('supertest');
const app = require('../src/app');
const { initDatabase, query } = require('../src/connection');
const { loginAsTeacher } = require('./authHelper');

describe('Students REST', () => {
  let auth;
  let createdId;

  beforeAll(async () => {
    await initDatabase();
    await query("DELETE FROM students WHERE email LIKE '%@students.test'");
    auth = await loginAsTeacher(app);
  });

  afterAll(async () => {
    await query("DELETE FROM students WHERE email LIKE '%@students.test'");
  });

  it('GET /students sem token retorna 401', async () => {
    const response = await request(app).get('/students');
    expect(response.status).toBe(401);
  });

  it('POST /students cria aluno', async () => {
    const response = await request(app).post('/students').set(auth).send({
      name: 'Aluno Integração',
      email: 'aluno.integracao@students.test',
      enrollment: 'RM999001',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Aluno Integração',
      email: 'aluno.integracao@students.test',
      enrollment: 'RM999001',
    });
    createdId = response.body.id;
  });

  it('GET /students retorna lista paginada', async () => {
    const response = await request(app).get('/students').set(auth).query({ page: 1, limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThanOrEqual(1);
    expect(response.body.limit).toBe(5);
  });

  it('PUT /students/:id atualiza aluno', async () => {
    const response = await request(app).put(`/students/${createdId}`).set(auth).send({
      name: 'Aluno Atualizado',
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Aluno Atualizado');
    expect(response.body.enrollment).toBe('RM999001');
  });

  it('POST /students com dados inválidos retorna 400', async () => {
    const response = await request(app).post('/students').set(auth).send({ name: 'Só nome' });

    expect(response.status).toBe(400);
  });

  it('DELETE /students/:id exclui aluno', async () => {
    const response = await request(app).delete(`/students/${createdId}`).set(auth);

    expect(response.status).toBe(204);
  });
});
