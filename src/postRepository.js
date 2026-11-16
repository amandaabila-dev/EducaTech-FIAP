const { query } = require('./connection');
const { mapPostRow } = require('./postMapper');

const COLS = 'id, titulo, conteudo, responsavel, materia, data_criacao, data_atualizacao';

async function count() {
  const result = await query('SELECT COUNT(*)::int AS total FROM posts');
  return result.rows[0].total;
}

async function findAll() {
  const result = await query(`SELECT ${COLS} FROM posts ORDER BY data_criacao DESC`);
  return result.rows.map(mapPostRow);
}

async function findPaginated(page, limit) {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT ${COLS} FROM posts ORDER BY data_criacao DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows.map(mapPostRow);
}

async function findById(id) {
  const result = await query(`SELECT ${COLS} FROM posts WHERE id = $1`, [id]);
  return result.rows[0] ? mapPostRow(result.rows[0]) : null;
}

async function search({ term, subject } = {}) {
  const filters = [];
  const params = [];

  if (term) {
    params.push(`%${term}%`);
    const index = params.length;
    filters.push(
      `(titulo ILIKE $${index} OR conteudo ILIKE $${index} OR materia ILIKE $${index} OR responsavel ILIKE $${index})`
    );
  }

  if (subject) {
    params.push(subject);
    filters.push(`materia ILIKE $${params.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await query(
    `SELECT ${COLS} FROM posts ${where} ORDER BY data_criacao DESC`,
    params
  );
  return result.rows.map(mapPostRow);
}

async function create(post) {
  const result = await query(
    `INSERT INTO posts (titulo, conteudo, responsavel, materia)
     VALUES ($1, $2, $3, $4) RETURNING ${COLS}`,
    [post.titulo, post.conteudo, post.responsavel, post.materia]
  );
  return mapPostRow(result.rows[0]);
}

async function update(id, post) {
  const result = await query(
    `UPDATE posts SET titulo=$1, conteudo=$2, responsavel=$3, materia=$4, data_atualizacao=NOW()
     WHERE id=$5 RETURNING ${COLS}`,
    [post.titulo, post.conteudo, post.responsavel, post.materia, id]
  );
  return result.rows[0] ? mapPostRow(result.rows[0]) : null;
}

async function remove(id) {
  const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

module.exports = {
  count,
  findAll,
  findPaginated,
  findById,
  search,
  create,
  update,
  remove,
};
