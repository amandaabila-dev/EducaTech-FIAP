const bcrypt = require('bcryptjs');
const teacherRepository = require('./teacherRepository');
const { erro, isUniqueViolation, parseId, parsePagination, isValidEmail } = require('./httpErrors');

function normalizeTeacherInput(data = {}) {
  return {
    nome: data.nome ?? data.name,
    email: data.email,
    senha: data.senha ?? data.password,
  };
}

function getProvidedTeacherFields(data = {}) {
  const normalized = normalizeTeacherInput(data);
  const provided = {};

  if ('nome' in data || 'name' in data) provided.nome = normalized.nome;
  if ('email' in data) provided.email = normalized.email;
  if ('senha' in data || 'password' in data) provided.senha = normalized.senha;

  return provided;
}

function validarCampos(dados, { senhaObrigatoria = false } = {}) {
  const errors = [];

  if (!dados.nome || !String(dados.nome).trim()) errors.push('Nome é obrigatório');
  if (!dados.email || !String(dados.email).trim()) errors.push('E-mail é obrigatório');
  else if (!isValidEmail(dados.email)) errors.push('E-mail inválido');

  if (senhaObrigatoria && (!dados.senha || String(dados.senha).length < 6)) {
    errors.push('Senha deve ter no mínimo 6 caracteres');
  }

  if (dados.nome && String(dados.nome).trim().length > 255) {
    errors.push('nome deve ter no máximo 255 caracteres');
  }
  if (dados.email && String(dados.email).trim().length > 255) {
    errors.push('email deve ter no máximo 255 caracteres');
  }

  return errors;
}

async function create(data) {
  const normalizado = normalizeTeacherInput(data);
  const errors = validarCampos(normalizado, { senhaObrigatoria: true });
  if (errors.length) erro(errors.join(', '), 400);

  try {
    return await teacherRepository.create({
      nome: String(normalizado.nome).trim(),
      email: String(normalizado.email).trim().toLowerCase(),
      senhaHash: await bcrypt.hash(String(normalizado.senha), teacherRepository.SALT_ROUNDS),
    });
  } catch (error) {
    if (isUniqueViolation(error)) erro('Já existe um professor com este e-mail', 409);
    throw error;
  }
}

async function findAll(query = {}) {
  const paginacao = parsePagination(query, { required: true });
  const subject = String(query.subject || query.materia || '').trim();
  const [items, total] = await Promise.all([
    teacherRepository.findPaginated(paginacao.page, paginacao.limit, subject),
    teacherRepository.count(subject),
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
  const teacher = await teacherRepository.findById(parseId(id));
  if (!teacher) erro('Professor não encontrado', 404);
  return teacher;
}

async function update(id, data) {
  const teacherId = parseId(id);
  const provided = getProvidedTeacherFields(data);
  if (!Object.keys(provided).length) erro('Nenhum campo para atualizar', 400);

  const existing = await teacherRepository.findById(teacherId, { includeHash: true });
  if (!existing) erro('Professor não encontrado', 404);

  const merged = {
    nome: provided.nome !== undefined ? provided.nome : existing.name,
    email: provided.email !== undefined ? provided.email : existing.email,
    senha: provided.senha,
  };

  const errors = validarCampos(merged, { senhaObrigatoria: provided.senha !== undefined });
  if (errors.length) erro(errors.join(', '), 400);

  const senhaHash =
    provided.senha !== undefined
      ? await bcrypt.hash(String(provided.senha), teacherRepository.SALT_ROUNDS)
      : existing.passwordHash;

  try {
    const updated = await teacherRepository.update(teacherId, {
      nome: String(merged.nome).trim(),
      email: String(merged.email).trim().toLowerCase(),
      senhaHash,
    });
    if (!updated) erro('Professor não encontrado', 404);
    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) erro('Já existe um professor com este e-mail', 409);
    throw error;
  }
}

async function deleteTeacher(id, currentUser = {}) {
  const teacherId = parseId(id);

  if (currentUser.id && Number(currentUser.id) === teacherId) {
    erro('Não é possível excluir o próprio usuário', 400);
  }

  const total = await teacherRepository.count();
  if (total <= 1) erro('Não é possível excluir o último professor', 400);

  const deleted = await teacherRepository.remove(teacherId);
  if (!deleted) erro('Professor não encontrado', 404);
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deleteTeacher,
};
