const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const teacherRepository = require('./teacherRepository');

function requiredEnv(name) {
  const value = String(process.env[name] || '').trim();

  if (!value) {
    const error = new Error(`Variável de ambiente ${name} não configurada.`);
    error.statusCode = 500;
    throw error;
  }

  return value;
}

function assertAuthConfig() {
  requiredEnv('JWT_SECRET');
  requiredEnv('AUTH_EMAIL');

  if (!String(process.env.AUTH_PASSWORD_HASH || '').trim() && !String(process.env.AUTH_PASSWORD || '').trim()) {
    const error = new Error('Configure AUTH_PASSWORD ou AUTH_PASSWORD_HASH.');
    error.statusCode = 500;
    throw error;
  }
}

function getJwtSecret() {
  return requiredEnv('JWT_SECRET');
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

async function authenticate(email, password) {
  assertAuthConfig();

  const emailInformado = String(email || '').trim().toLowerCase();
  const senhaInformada = String(password || '');
  const teacher = await teacherRepository.findByEmail(emailInformado, { includeHash: true });

  if (!teacher) {
    const error = new Error('E-mail ou senha inválidos.');
    error.statusCode = 401;
    throw error;
  }

  const senhaValida = await bcrypt.compare(senhaInformada, teacher.passwordHash);
  if (!senhaValida) {
    const error = new Error('E-mail ou senha inválidos.');
    error.statusCode = 401;
    throw error;
  }

  return {
    id: teacher.id,
    email: teacher.email,
    name: teacher.name,
    role: 'professor',
  };
}

module.exports = {
  assertAuthConfig,
  authenticate,
  signToken,
  verifyToken,
};
