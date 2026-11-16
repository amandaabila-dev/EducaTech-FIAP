function erro(mensagem, statusCode) {
  const error = new Error(mensagem);
  error.statusCode = statusCode;
  throw error;
}

function isUniqueViolation(error) {
  return Boolean(error && error.code === '23505');
}

function parseId(id, label = 'ID') {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    erro(`${label} inválido`, 400);
  }
  return parsedId;
}

function parsePagination(query = {}, { required = false } = {}) {
  if (!required && query.page == null && query.limit == null) return null;

  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (!Number.isInteger(page) || page <= 0) erro('Parâmetro page inválido', 400);
  if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
    erro('Parâmetro limit inválido (máximo 100)', 400);
  }

  return { page, limit };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

module.exports = {
  erro,
  isUniqueViolation,
  parseId,
  parsePagination,
  isValidEmail,
};
