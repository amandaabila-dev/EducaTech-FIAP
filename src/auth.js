const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

let cachedPasswordHash;

function getJwtSecret() {
  return process.env.JWT_SECRET || 'educatech-dev-jwt-secret';
}

function getTeacher() {
  return {
    email: String(process.env.AUTH_EMAIL || 'professor@educatech.com').trim().toLowerCase(),
    name: process.env.AUTH_NAME || 'Prof. Amanda Abila Melo',
    role: 'professor',
  };
}

function getPasswordHash() {
  if (process.env.AUTH_PASSWORD_HASH) {
    return process.env.AUTH_PASSWORD_HASH;
  }

  if (!cachedPasswordHash) {
    cachedPasswordHash = bcrypt.hashSync(process.env.AUTH_PASSWORD || 'educatech123', SALT_ROUNDS);
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
  authenticate,
  getTeacher,
  signToken,
  verifyToken,
};
