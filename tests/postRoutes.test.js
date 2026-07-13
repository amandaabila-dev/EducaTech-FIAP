process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://educatech:educatech@localhost:5432/educatech';

const request = require('supertest');
const app = require('../src/app');
const { initDatabase, query } = require('../src/connection');
const { cleanupTestPosts, buildRestPost } = require('./integrationDb');

describe('Posts REST - Integration Tests', () => {
  let createdPostId;

  beforeAll(async () => {
    await initDatabase();
    await cleanupTestPosts(query);
  });

  afterAll(async () => {
    await cleanupTestPosts(query);
  });

  it('GET /posts retorna lista sem posts de teste inicialmente', async () => {
    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(
      response.body.every((post) => !post.title?.startsWith('__integration_test__'))
    ).toBe(true);
  });

  it('POST /posts cria um post', async () => {
    const payload = buildRestPost({ title: `${buildRestPost().title} principal` });

    const response = await request(app).post('/posts').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    createdPostId = response.body.id;
    expect(response.body).toMatchObject({
      title: payload.title,
      content: payload.content,
      author: payload.author,
      subject: payload.subject,
    });
  });

  it('GET /posts/:id retorna o post criado', async () => {
    const response = await request(app).get(`/posts/${createdPostId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdPostId);
    expect(response.body.title).toContain('principal');
  });

  it('PUT /posts/:id atualiza o post', async () => {
    const response = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({
        title: `${buildRestPost().title} atualizado`,
        content: 'Conteúdo atualizado',
        author: buildRestPost().author,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toContain('atualizado');
    expect(response.body.content).toBe('Conteúdo atualizado');
  });

  it('PUT /posts/:id aceita atualização parcial', async () => {
    const response = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ title: `${buildRestPost().title} parcial` });

    expect(response.status).toBe(200);
    expect(response.body.title).toContain('parcial');
    expect(response.body.content).toBe('Conteúdo atualizado');
    expect(response.body.author).toBe(buildRestPost().author);
  });

  it('GET /posts/search encontra posts pelo termo', async () => {
    const response = await request(app).get('/posts/search').query({ q: 'parcial' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toContain('parcial');
  });

  it('GET /posts/search encontra posts pelo autor', async () => {
    const response = await request(app).get('/posts/search').query({ q: buildRestPost().author });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].author).toBe(buildRestPost().author);
  });

  it('GET /posts?page=1&limit=1 retorna resultado paginado', async () => {
    await request(app).post('/posts').send(
      buildRestPost({ title: `${buildRestPost().title} segundo` })
    );

    const response = await request(app).get('/posts').query({ page: 1, limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(1);
    expect(response.body.total).toBeGreaterThanOrEqual(2);
    expect(response.body.items).toHaveLength(1);
  });

  it('DELETE /posts/:id exclui o post', async () => {
    const response = await request(app).delete(`/posts/${createdPostId}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('GET /posts/:id retorna 404 após exclusão', async () => {
    const response = await request(app).get(`/posts/${createdPostId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post não encontrado');
  });

  it('GET /posts/:id retorna 404 quando post não existe', async () => {
    const response = await request(app).get('/posts/999999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post não encontrado');
  });

  it('POST /posts retorna 400 quando dados são inválidos', async () => {
    const response = await request(app).post('/posts').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Titulo é obrigatório');
  });

  it('GET /posts/:id retorna 400 quando ID é inválido', async () => {
    const response = await request(app).get('/posts/abc');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID inválido');
  });

  it('POST /posts retorna 400 quando título excede limite', async () => {
    const response = await request(app).post('/posts').send(
      buildRestPost({ title: 'a'.repeat(256) })
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('titulo deve ter no máximo 255 caracteres');
  });

  it('GET /health retorna status do banco', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      database: 'connected',
      application: 'EducaTechFIAP',
    });
  });

  it('GET / retorna mapa da aplicação', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.application).toBe('EducaTechFIAP');
    expect(response.body.docs).toBe('/api-docs');
  });

  it('GET /rota-inexistente retorna 404', async () => {
    const response = await request(app).get('/rota-inexistente');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Rota não encontrada');
  });

  it('responde headers CORS e preflight OPTIONS', async () => {
    const optionsResponse = await request(app).options('/posts');

    expect(optionsResponse.status).toBe(204);
    expect(optionsResponse.headers['access-control-allow-origin']).toBe('*');
    expect(optionsResponse.headers['access-control-allow-methods']).toContain('GET');
  });
});
