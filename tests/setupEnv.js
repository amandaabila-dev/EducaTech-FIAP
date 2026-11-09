const crypto = require('crypto');

require('dotenv').config({ quiet: true });

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
}

if (!process.env.AUTH_EMAIL) {
  process.env.AUTH_EMAIL = 'professor.teste@educatech.local';
}

if (!process.env.AUTH_PASSWORD && !process.env.AUTH_PASSWORD_HASH) {
  process.env.AUTH_PASSWORD = crypto.randomBytes(24).toString('hex');
}

if (!process.env.AUTH_NAME) {
  process.env.AUTH_NAME = 'Professor Teste';
}
