process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://educatech:educatech@localhost:5432/educatech';

const request = require('supertest');
const app = require('../src/app');
const { initDatabase, query } = require('../src/connection');
const { loginAsTeacher } = require('./authHelper');

describe('Teachers REST', () => {
  let auth;
  let createdId;

  beforeAll(async () => {
    await initDatabase();
    await query("DELETE FROM teachers WHERE email LIKE '%@teachers.test'");
    auth = await loginAsTeacher(app);
  });

  afterAll(async () => {
    await query("DELETE FROM teachers WHERE email LIKE '%@teachers.test'");
  });

  it('GET /teachers sem token retorna 401', async () => {
    const response = await request(app).get('/teachers');
    expect(response.status).toBe(401);
  });

  it('GET /teachers retorna lista paginada', async () => {
    const response = await request(app).get('/teachers').set(auth).query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /teachers?subject= filtra por matéria lecionada', async () => {
    const response = await request(app)
      .get('/teachers')
      .set(auth)
      .query({ page: 1, limit: 20, subject: 'Front-End' });

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.items.every((teacher) => teacher.subjects.includes('Front-End'))).toBe(true);
  });

  it('POST /teachers cria professor', async () => {
    const response = await request(app).post('/teachers').set(auth).send({
      name: 'Prof. Integração',
      email: 'prof.integracao@teachers.test',
      password: 'senha123',
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('prof.integracao@teachers.test');
    expect(response.body.passwordHash).toBeUndefined();
    createdId = response.body.id;
  });

  it('POST /teachers com e-mail duplicado retorna 409', async () => {
    const response = await request(app).post('/teachers').set(auth).send({
      name: 'Duplicado',
      email: 'prof.integracao@teachers.test',
      password: 'senha123',
    });

    expect(response.status).toBe(409);
  });

  it('GET /teachers/:id retorna o professor', async () => {
    const response = await request(app).get(`/teachers/${createdId}`).set(auth);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdId);
    expect(response.body.name).toBe('Prof. Integração');
  });

  it('PUT /teachers/:id atualiza nome', async () => {
    const response = await request(app).put(`/teachers/${createdId}`).set(auth).send({
      name: 'Prof. Atualizado',
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Prof. Atualizado');
  });

  it('DELETE /teachers/:id exclui professor', async () => {
    const response = await request(app).delete(`/teachers/${createdId}`).set(auth);

    expect(response.status).toBe(204);
  });

  it('GET /teachers/:id retorna 404 após exclusão', async () => {
    const response = await request(app).get(`/teachers/${createdId}`).set(auth);

    expect(response.status).toBe(404);
  });
});
