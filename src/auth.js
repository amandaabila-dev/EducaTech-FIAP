const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

let cachedPasswordHash;

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

function getTeacher() {
  return {
    email: requiredEnv('AUTH_EMAIL').toLowerCase(),
    name: String(process.env.AUTH_NAME || 'Professor').trim(),
    role: 'professor',
  };
}

function getPasswordHash() {
  const hashConfigurado = String(process.env.AUTH_PASSWORD_HASH || '').trim();

  if (hashConfigurado) {
    return hashConfigurado;
  }

  if (!cachedPasswordHash) {
    cachedPasswordHash = bcrypt.hashSync(requiredEnv('AUTH_PASSWORD'), SALT_ROUNDS);
  }

  return cachedPasswordHash;
}

function signToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

async function authenticate(email, password) {
  assertAuthConfig();

  const teacher = getTeacher();
  const emailInformado = String(email || '').trim().toLowerCase();
  const senhaInformada = String(password || '');
  const senhaValida = await bcrypt.compare(senhaInformada, getPasswordHash());

  if (emailInformado !== teacher.email || !senhaValida) {
    const error = new Error('E-mail ou senha inválidos.');
    error.statusCode = 401;
    throw error;
  }

  return teacher;
}

module.exports = {
  assertAuthConfig,
  authenticate,
  getTeacher,
  signToken,
  verifyToken,
};
