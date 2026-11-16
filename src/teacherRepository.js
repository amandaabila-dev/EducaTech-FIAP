const bcrypt = require('bcryptjs');
const { query } = require('./connection');

const SALT_ROUNDS = 10;

const EMAIL_DOMAIN = 'educatechfiap.com.br';
const COLS = 'id, nome, email, senha_hash, data_criacao, data_atualizacao';
const SUBJECTS_SQL = `COALESCE((
  SELECT ARRAY_AGG(DISTINCT TRIM(p.materia) ORDER BY TRIM(p.materia))
  FROM posts p
  WHERE TRIM(p.responsavel) = teachers.nome
    AND p.materia IS NOT NULL AND TRIM(p.materia) <> ''
), ARRAY[]::varchar[]) AS materias`;

function mapTeacherRow(row, { includeHash = false } = {}) {
  const teacher = {
    id: row.id,
    name: row.nome,
    email: row.email,
    subjects: Array.isArray(row.materias) ? row.materias.filter(Boolean) : [],
    createdAt: row.data_criacao,
    updatedAt: row.data_atualizacao,
  };

  if (includeHash) {
    teacher.passwordHash = row.senha_hash;
  }

  return teacher;
}

function subjectFilter(subject) {
  const materia = String(subject || '').trim();
  if (!materia) return { clause: '', params: [] };
  return {
    clause: `WHERE EXISTS (
      SELECT 1 FROM posts p
      WHERE TRIM(p.responsavel) = teachers.nome
        AND p.materia ILIKE $1
    )`,
    params: [materia],
  };
}

async function count(subject) {
  const filtro = subjectFilter(subject);
  const result = await query(
    `SELECT COUNT(*)::int AS total FROM teachers ${filtro.clause}`,
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
    `SELECT ${COLS}, ${SUBJECTS_SQL}
     FROM teachers ${filtro.clause}
     ORDER BY nome ASC LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`,
    params
  );
  return result.rows.map((row) => mapTeacherRow(row));
}

async function findById(id, { includeHash = false } = {}) {
  const result = await query(
    `SELECT ${COLS}, ${SUBJECTS_SQL} FROM teachers WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapTeacherRow(result.rows[0], { includeHash }) : null;
}

async function findByEmail(email, { includeHash = false } = {}) {
  const result = await query(`SELECT ${COLS} FROM teachers WHERE email = $1`, [email]);
  return result.rows[0] ? mapTeacherRow(result.rows[0], { includeHash }) : null;
}

async function create(teacher) {
  const result = await query(
    `INSERT INTO teachers (nome, email, senha_hash)
     VALUES ($1, $2, $3) RETURNING ${COLS}`,
    [teacher.nome, teacher.email, teacher.senhaHash]
  );
  return mapTeacherRow(result.rows[0]);
}

async function update(id, teacher) {
  const result = await query(
    `UPDATE teachers
     SET nome=$1, email=$2, senha_hash=$3, data_atualizacao=NOW()
     WHERE id=$4 RETURNING ${COLS}`,
    [teacher.nome, teacher.email, teacher.senhaHash, id]
  );
  return result.rows[0] ? mapTeacherRow(result.rows[0]) : null;
}

async function remove(id) {
  const result = await query('DELETE FROM teachers WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

async function seedBootstrapTeacher() {
  const email = String(process.env.AUTH_EMAIL || '').trim().toLowerCase();
  const nome = String(process.env.AUTH_NAME || 'Professor').trim();
  const hashConfigurado = String(process.env.AUTH_PASSWORD_HASH || '').trim();
  const senha = String(process.env.AUTH_PASSWORD || '').trim();

  if (!email) return;

  const existing = await query('SELECT id FROM teachers WHERE email = $1', [email]);
  if (existing.rows.length) return;

  const senhaHash = hashConfigurado || (senha ? bcrypt.hashSync(senha, SALT_ROUNDS) : '');
  if (!senhaHash) {
    const error = new Error('Configure AUTH_PASSWORD ou AUTH_PASSWORD_HASH para o professor inicial.');
    error.statusCode = 500;
    throw error;
  }

  await query('INSERT INTO teachers (nome, email, senha_hash) VALUES ($1, $2, $3)', [
    nome,
    email,
    senhaHash,
  ]);
}

function emailFromAuthor(nome) {
  const limpo = String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^prof[^\s]*\s+/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');

  return `${limpo || 'professor'}@${EMAIL_DOMAIN}`;
}

async function migrateInstitutionEmails() {
  await query(`
    UPDATE teachers
    SET email = regexp_replace(email, '@(aluno\\.)?educatech\\.local$', '@${EMAIL_DOMAIN}')
    WHERE email ~* '@(aluno\\.)?educatech\\.local$'
  `);
  await query(`
    UPDATE students
    SET email = regexp_replace(email, '@(aluno\\.)?educatech\\.local$', '@${EMAIL_DOMAIN}')
    WHERE email ~* '@(aluno\\.)?educatech\\.local$'
  `);
}

async function seedAuthorsAsTeachers() {
  const authors = await query(
    `SELECT DISTINCT TRIM(responsavel) AS nome
     FROM posts
     WHERE responsavel IS NOT NULL AND TRIM(responsavel) <> ''`
  );

  const senhaHash = bcrypt.hashSync('senha123', SALT_ROUNDS);

  for (const row of authors.rows) {
    await query(
      `INSERT INTO teachers (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome`,
      [row.nome, emailFromAuthor(row.nome), senhaHash]
    );
  }
}

module.exports = {
  SALT_ROUNDS,
  EMAIL_DOMAIN,
  count,
  findPaginated,
  findById,
  findByEmail,
  create,
  update,
  remove,
  migrateInstitutionEmails,
  seedBootstrapTeacher,
  seedAuthorsAsTeachers,
};
