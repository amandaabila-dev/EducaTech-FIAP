const MAX_LENGTH = { titulo: 255, responsavel: 255, materia: 255 };

function normalizePostInput(data = {}) {
  return {
    titulo: data.titulo ?? data.Titulo ?? data.title ?? data.Title,
    conteudo: data.conteudo ?? data.Conteudo ?? data.content ?? data.Content,
    responsavel: data.responsavel ?? data.Responsavel ?? data.author ?? data.Author,
    materia: data.materia ?? data.Materia ?? data.subject ?? data.Subject ?? null,
  };
}

function getProvidedPostFields(data = {}) {
  const normalized = normalizePostInput(data);
  const provided = {};

  if ('titulo' in data || 'Titulo' in data || 'title' in data || 'Title' in data) {
    provided.titulo = normalized.titulo;
  }
  if ('conteudo' in data || 'Conteudo' in data || 'content' in data || 'Content' in data) {
    provided.conteudo = normalized.conteudo;
  }
  if ('responsavel' in data || 'Responsavel' in data || 'author' in data || 'Author' in data) {
    provided.responsavel = normalized.responsavel;
  }
  if ('materia' in data || 'Materia' in data || 'subject' in data || 'Subject' in data) {
    provided.materia = normalized.materia;
  }

  return provided;
}

function mapPostRow(row) {
  return {
    Id: row.id,
    Titulo: row.titulo,
    Conteudo: row.conteudo,
    Responsavel: row.responsavel,
    Materia: row.materia,
    DataDeCriacao: row.data_criacao,
    DataDeAtualizacao: row.data_atualizacao,
  };
}

function mapPostForRest(post) {
  return {
    id: post.Id,
    title: post.Titulo,
    content: post.Conteudo,
    author: post.Responsavel,
    subject: post.Materia,
    createdAt: post.DataDeCriacao,
    updatedAt: post.DataDeAtualizacao,
  };
}

function mapPostsForRest(posts) {
  return posts.map(mapPostForRest);
}

module.exports = {
  MAX_LENGTH,
  normalizePostInput,
  getProvidedPostFields,
  mapPostRow,
  mapPostForRest,
  mapPostsForRest,
};
