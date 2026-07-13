process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://educatech:educatech@localhost:5432/educatech';

const request = require('supertest');
const app = require('../src/app');
const { initDatabase, query } = require('../src/connection');
const { cleanupTestPosts, buildUiFlowPost } = require('./integrationDb');

describe('UI Flows - Integration Tests', () => {
  let createdPostId;

  beforeAll(async () => {
    await initDatabase();
    await cleanupTestPosts(query);
  });

  afterAll(async () => {
    await cleanupTestPosts(query);
  });

  it('GET /Home retorna formato Fase 1', async () => {
    const response = await request(app).get('/Home');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      Application: 'EducaTechFIAP',
      MainFlow: 'MainFlow',
      Screen: 'Home',
      Profile: 'Aluno',
      PageTitle: 'Home',
    });
    expect(Array.isArray(response.body.Posts)).toBe(true);
  });

  it('POST /NewPost cria postagem no formato Fase 1', async () => {
    const payload = buildUiFlowPost();

    const response = await request(app).post('/NewPost').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      Application: 'EducaTechFIAP',
      Screen: 'NewPost',
      Profile: 'Professor',
      PageTitle: 'Nova Postagem',
      Message: 'Postagem criada com sucesso',
    });
    expect(response.body.Post).toMatchObject({
      Titulo: payload.Titulo,
      Conteudo: payload.Conteudo,
      Responsavel: payload.Responsavel,
      Materia: payload.Materia,
    });
    createdPostId = response.body.Post.Id;
  });

  it('GET /Admin lista postagens no formato Fase 1', async () => {
    const response = await request(app).get('/Admin');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      Application: 'EducaTechFIAP',
      Screen: 'Admin',
      Profile: 'Professor',
      PageTitle: 'Área do Professor',
    });
    expect(response.body.Posts.some((post) => post.Id === createdPostId)).toBe(true);
    expect(response.body.Posts[0]).toHaveProperty('Titulo');
    expect(response.body.Posts[0]).toHaveProperty('DataDeCriacao');
  });

  it('GET /PostPage/:id retorna post no formato Fase 1', async () => {
    const response = await request(app).get(`/PostPage/${createdPostId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      Screen: 'PostPage',
      Profile: 'Aluno',
    });
    expect(response.body.Post.Id).toBe(createdPostId);
    expect(response.body.Post.Titulo).toContain('__integration_test__');
  });

  it('PUT /PostEdition/:id atualiza postagem', async () => {
    const response = await request(app)
      .put(`/PostEdition/${createdPostId}`)
      .send({ Titulo: `${buildUiFlowPost().Titulo} editada` });

    expect(response.status).toBe(200);
    expect(response.body.Screen).toBe('PostEdition');
    expect(response.body.Message).toBe('Postagem atualizada com sucesso');
    expect(response.body.Post.Titulo).toContain('editada');
  });

  it('GET /PostSearch encontra postagens por termo', async () => {
    const response = await request(app).get('/PostSearch').query({ q: 'editada' });

    expect(response.status).toBe(200);
    expect(response.body.Screen).toBe('PostSearch');
    expect(response.body.Query).toBe('editada');
    expect(response.body.Posts.length).toBeGreaterThan(0);
  });

  it('GET /Login retorna tela inativa no formato Fase 1', async () => {
    const response = await request(app).get('/Login');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      Application: 'EducaTechFIAP',
      Screen: 'Login',
      Active: false,
    });
    expect(response.body.Labels).toHaveProperty('areaDoProfessor');
  });

  it('DELETE /PostDeletion/:id exclui postagem', async () => {
    const response = await request(app).delete(`/PostDeletion/${createdPostId}`);

    expect(response.status).toBe(200);
    expect(response.body.Screen).toBe('PostDeletion');
    expect(response.body.Message).toBe('Post excluído com sucesso');
  });

  it('GET /PostPage/:id retorna 404 após exclusão', async () => {
    const response = await request(app).get(`/PostPage/${createdPostId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Post não encontrado');
  });
});
