<<<<<<< HEAD
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EducaTech FIAP API',
    version: '3.0.0',
    description: 'API REST e UI Flows do EducaTech FIAP — consumida pelo front-end React da Fase 3',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/posts': {
      get: { summary: 'Lista postagens' },
      post: { summary: 'Cria postagem' },
    },
    '/posts/{id}': {
      get: { summary: 'Busca postagem por ID' },
      put: { summary: 'Atualiza postagem' },
      delete: { summary: 'Remove postagem' },
    },
    '/posts/search': {
      get: { summary: 'Busca postagens por termo' },
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
=======
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EducaTech FIAP API',
    version: '2.0.0',
    description: 'API REST e UI Flows do EducaTech FIAP',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/posts': {
      get: { summary: 'Lista postagens' },
      post: { summary: 'Cria postagem' },
    },
    '/posts/{id}': {
      get: { summary: 'Busca postagem por ID' },
      put: { summary: 'Atualiza postagem' },
      delete: { summary: 'Remove postagem' },
    },
    '/posts/search': {
      get: { summary: 'Busca postagens por termo' },
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
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
