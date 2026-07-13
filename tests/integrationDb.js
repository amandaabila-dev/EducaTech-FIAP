const TEST_MARKER = '__integration_test__';

async function cleanupTestPosts(query) {
  await query('DELETE FROM posts WHERE titulo LIKE $1 OR responsavel = $2', [
    `${TEST_MARKER}%`,
    TEST_MARKER,
  ]);
}

function buildRestPost(overrides = {}) {
  return {
    title: `${TEST_MARKER} Post`,
    content: 'Conteúdo criado nos testes de integração',
    author: TEST_MARKER,
    subject: 'Testes',
    ...overrides,
  };
}

function buildUiFlowPost(overrides = {}) {
  return {
    Titulo: `${TEST_MARKER} Postagem UI`,
    Conteudo: 'Conteúdo da UI Flow nos testes',
    Responsavel: TEST_MARKER,
    Materia: 'Integração',
    ...overrides,
  };
}

module.exports = {
  TEST_MARKER,
  cleanupTestPosts,
  buildRestPost,
  buildUiFlowPost,
};
