const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EducaTech FIAP API',
    version: '4.0.0',
    description:
      'API REST do EducaTech FIAP. Leitura de posts é pública; login, CRUD de posts, professores e alunos exigem JWT de professor.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/login': {
      post: {
        summary: 'Autentica o professor (tabela teachers) e devolve um JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    '/posts': {
      get: { summary: 'Lista postagens (público)' },
      post: { summary: 'Cria postagem', security: [{ bearerAuth: [] }] },
    },
    '/posts/{id}': {
      get: { summary: 'Busca postagem por ID (público)' },
      put: { summary: 'Atualiza postagem', security: [{ bearerAuth: [] }] },
      delete: { summary: 'Remove postagem', security: [{ bearerAuth: [] }] },
    },
    '/posts/search': {
      get: {
        summary: 'Busca postagens por palavra-chave (q) e/ou matéria (subject)',
      },
    },
    '/teachers': {
      get: { summary: 'Lista professores paginada (filtro opcional subject)', security: [{ bearerAuth: [] }] },
      post: { summary: 'Cadastra professor', security: [{ bearerAuth: [] }] },
    },
    '/teachers/{id}': {
      get: { summary: 'Busca professor por ID', security: [{ bearerAuth: [] }] },
      put: { summary: 'Atualiza professor', security: [{ bearerAuth: [] }] },
      delete: { summary: 'Remove professor', security: [{ bearerAuth: [] }] },
    },
    '/students': {
      get: { summary: 'Lista alunos paginada (filtro opcional subject)', security: [{ bearerAuth: [] }] },
      post: { summary: 'Cadastra aluno', security: [{ bearerAuth: [] }] },
    },
    '/students/{id}': {
      get: { summary: 'Busca aluno por ID', security: [{ bearerAuth: [] }] },
      put: { summary: 'Atualiza aluno', security: [{ bearerAuth: [] }] },
      delete: { summary: 'Remove aluno', security: [{ bearerAuth: [] }] },
    },
    '/Home': { get: { summary: 'Lista da home (formato compatível OutSystems)' } },
    '/Admin': { get: { summary: 'Área do professor (formato compatível OutSystems)' } },
    '/health': { get: { summary: 'Health check' } },
  },
};

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
