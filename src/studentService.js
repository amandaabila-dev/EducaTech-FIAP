const studentRepository = require('./studentRepository');
const { erro, isUniqueViolation, parseId, parsePagination, isValidEmail } = require('./httpErrors');

function normalizeStudentInput(data = {}) {
  return {
    nome: data.nome ?? data.name,
    email: data.email,
    matricula: data.matricula ?? data.enrollment,
    materia: data.materia ?? data.subject,
  };
}

function getProvidedStudentFields(data = {}) {
  const normalized = normalizeStudentInput(data);
  const provided = {};

  if ('nome' in data || 'name' in data) provided.nome = normalized.nome;
  if ('email' in data) provided.email = normalized.email;
  if ('matricula' in data || 'enrollment' in data) provided.matricula = normalized.matricula;
  if ('materia' in data || 'subject' in data) provided.materia = normalized.materia;

  return provided;
}

function validarCampos(dados) {
  const errors = [];

  if (!dados.nome || !String(dados.nome).trim()) errors.push('Nome é obrigatório');
  if (!dados.email || !String(dados.email).trim()) errors.push('E-mail é obrigatório');
  else if (!isValidEmail(dados.email)) errors.push('E-mail inválido');

  if (dados.nome && String(dados.nome).trim().length > 255) {
    errors.push('nome deve ter no máximo 255 caracteres');
  }
  if (dados.email && String(dados.email).trim().length > 255) {
    errors.push('email deve ter no máximo 255 caracteres');
  }
  if (dados.matricula && String(dados.matricula).length > 50) {
    errors.push('matricula deve ter no máximo 50 caracteres');
  }
  if (dados.materia && String(dados.materia).trim().length > 255) {
    errors.push('materia deve ter no máximo 255 caracteres');
  }

  return errors;
}

function preparar(dados) {
  const matricula =
    dados.matricula == null || String(dados.matricula).trim() === ''
      ? null
      : String(dados.matricula).trim();

  const materia =
    dados.materia == null || String(dados.materia).trim() === ''
      ? null
      : String(dados.materia).trim();

  return {
    nome: String(dados.nome).trim(),
    email: String(dados.email).trim().toLowerCase(),
    matricula,
    materia,
  };
}

async function create(data) {
  const normalizado = normalizeStudentInput(data);
  const errors = validarCampos(normalizado);
  if (errors.length) erro(errors.join(', '), 400);

  try {
    return await studentRepository.create(preparar(normalizado));
  } catch (error) {
    if (isUniqueViolation(error)) erro('Já existe um aluno com este e-mail', 409);
    throw error;
  }
}

async function findAll(query = {}) {
  const paginacao = parsePagination(query, { required: true });
  const subject = String(query.subject || query.materia || '').trim();
  const [items, total] = await Promise.all([
    studentRepository.findPaginated(paginacao.page, paginacao.limit, subject),
    studentRepository.count(subject),
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
  const student = await studentRepository.findById(parseId(id));
  if (!student) erro('Aluno não encontrado', 404);
  return student;
}

async function update(id, data) {
  const studentId = parseId(id);
  const provided = getProvidedStudentFields(data);
  if (!Object.keys(provided).length) erro('Nenhum campo para atualizar', 400);

  const existing = await studentRepository.findById(studentId);
  if (!existing) erro('Aluno não encontrado', 404);

  const merged = {
    nome: provided.nome !== undefined ? provided.nome : existing.name,
    email: provided.email !== undefined ? provided.email : existing.email,
    matricula: provided.matricula !== undefined ? provided.matricula : existing.enrollment,
    materia: provided.materia !== undefined ? provided.materia : existing.subject,
  };

  const errors = validarCampos(merged);
  if (errors.length) erro(errors.join(', '), 400);

  try {
    const updated = await studentRepository.update(studentId, preparar(merged));
    if (!updated) erro('Aluno não encontrado', 404);
    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) erro('Já existe um aluno com este e-mail', 409);
    throw error;
  }
}

async function deleteStudent(id) {
  const deleted = await studentRepository.remove(parseId(id));
  if (!deleted) erro('Aluno não encontrado', 404);
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deleteStudent,
};
