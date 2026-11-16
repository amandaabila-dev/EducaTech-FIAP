const postRepository = require('./postRepository');
const { erro, parseId, parsePagination } = require('./httpErrors');
const {
  MAX_LENGTH,
  normalizePostInput,
  getProvidedPostFields,
} = require('./postMapper');

function validarCampos(dados, parcial = false) {
  const errors = [];
  const campos = [
    ['titulo', 'Titulo'],
    ['conteudo', 'Conteudo'],
    ['responsavel', 'Responsavel'],
  ];

  for (const [campo, label] of campos) {
    if (parcial && dados[campo] === undefined) continue;
    if (!dados[campo] || !String(dados[campo]).trim()) {
      errors.push(`${label} é obrigatório`);
    }
  }

  for (const [campo, limite] of Object.entries(MAX_LENGTH)) {
    if (dados[campo] != null && String(dados[campo]).length > limite) {
      errors.push(`${campo} deve ter no máximo ${limite} caracteres`);
    }
  }

  return errors;
}

function prepararPost(dados) {
  const n = normalizePostInput(dados);
  return {
    titulo: String(n.titulo).trim(),
    conteudo: String(n.conteudo).trim(),
    responsavel: String(n.responsavel).trim(),
    materia: n.materia ? String(n.materia).trim() : null,
  };
}

async function create(data) {
  const errors = validarCampos(normalizePostInput(data));
  if (errors.length) erro(errors.join(', '), 400);
  return postRepository.create(prepararPost(data));
}

async function findAll(query = {}) {
  const paginacao = parsePagination(query);
  if (!paginacao) return postRepository.findAll();

  const [items, total] = await Promise.all([
    postRepository.findPaginated(paginacao.page, paginacao.limit),
    postRepository.count(),
  ]);

  return {
    items,
    page: paginacao.page,
    limit: paginacao.limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / paginacao.limit),
  };
}

async function findById(id) {
  const post = await postRepository.findById(parseId(id));
  if (!post) erro('Post não encontrado', 404);
  return post;
}

async function update(id, data) {
  const postId = parseId(id);
  const provided = getProvidedPostFields(data);
  if (!Object.keys(provided).length) erro('Nenhum campo para atualizar', 400);

  const errors = validarCampos(provided, true);
  if (errors.length) erro(errors.join(', '), 400);

  const existing = await postRepository.findById(postId);
  if (!existing) erro('Post não encontrado', 404);

  const merged = {
    titulo: provided.titulo !== undefined ? String(provided.titulo).trim() : existing.Titulo,
    conteudo: provided.conteudo !== undefined ? String(provided.conteudo).trim() : existing.Conteudo,
    responsavel:
      provided.responsavel !== undefined ? String(provided.responsavel).trim() : existing.Responsavel,
    materia:
      provided.materia !== undefined
        ? provided.materia == null || provided.materia === ''
          ? null
          : String(provided.materia).trim()
        : existing.Materia,
  };

  const updated = await postRepository.update(postId, merged);
  if (!updated) erro('Post não encontrado', 404);
  return updated;
}

async function deletePost(id) {
  const deleted = await postRepository.remove(parseId(id));
  if (!deleted) erro('Post não encontrado', 404);
}

async function search(termOrQuery) {
  const query =
    termOrQuery && typeof termOrQuery === 'object' && !Array.isArray(termOrQuery)
      ? termOrQuery
      : { q: termOrQuery };

  const term = String(query.q || query.term || '').trim();
  const subject = String(query.subject || query.materia || '').trim();

  if (!term && !subject) {
    erro('Informe uma palavra-chave (q) ou uma matéria (subject)', 400);
  }

  return postRepository.search({ term, subject });
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deletePost,
  search,
};
