const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EducaTech FIAP API',
    version: '3.1.0',
    description:
      'API REST do EducaTech FIAP. Leitura é pública; criação, edição e exclusão exigem JWT obtido em POST /login.',
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
        summary: 'Autentica o professor e devolve um JWT',
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
      get: { summary: 'Busca postagens por termo (público)' },
    },
    '/Home': { get: { summary: 'Tela Home (Fase 1)' } },
    '/Admin': { get: { summary: 'Área do Professor (Fase 1)' } },
    '/health': { get: { summary: 'Health check' } },
  },
};

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
