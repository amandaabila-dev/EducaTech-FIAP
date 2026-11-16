const { query } = require('./connection');

const COLS = 'id, nome, email, matricula, materia, data_criacao, data_atualizacao';

function mapStudentRow(row) {
  return {
    id: row.id,
    name: row.nome,
    email: row.email,
    enrollment: row.matricula,
    subject: row.materia,
    createdAt: row.data_criacao,
    updatedAt: row.data_atualizacao,
  };
}

function subjectFilter(subject) {
  const materia = String(subject || '').trim();
  if (!materia) return { clause: '', params: [] };
  return { clause: 'WHERE materia ILIKE $1', params: [materia] };
}

async function count(subject) {
  const filtro = subjectFilter(subject);
  const result = await query(
    `SELECT COUNT(*)::int AS total FROM students ${filtro.clause}`,
    filtro.params
  );
  return result.rows[0].total;
}

async function findPaginated(page, limit, subject) {
  const offset = (page - 1) * limit;
  const filtro = subjectFilter(subject);
  const params = [...filtro.params, limit, offset];
  const limitIndex = filtro.params.length + 1;
  const result = await query(
    `SELECT ${COLS} FROM students ${filtro.clause}
     ORDER BY nome ASC LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`,
    params
  );
  return result.rows.map(mapStudentRow);
}

async function findById(id) {
  const result = await query(`SELECT ${COLS} FROM students WHERE id = $1`, [id]);
  return result.rows[0] ? mapStudentRow(result.rows[0]) : null;
}

async function create(student) {
  const result = await query(
    `INSERT INTO students (nome, email, matricula, materia)
     VALUES ($1, $2, $3, $4) RETURNING ${COLS}`,
    [student.nome, student.email, student.matricula, student.materia]
  );
  return mapStudentRow(result.rows[0]);
}

async function update(id, student) {
  const result = await query(
    `UPDATE students
     SET nome=$1, email=$2, matricula=$3, materia=$4, data_atualizacao=NOW()
     WHERE id=$5 RETURNING ${COLS}`,
    [student.nome, student.email, student.matricula, student.materia, id]
  );
  return result.rows[0] ? mapStudentRow(result.rows[0]) : null;
}

async function remove(id) {
  const result = await query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

module.exports = {
  count,
  findPaginated,
  findById,
  create,
  update,
  remove,
};
