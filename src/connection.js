const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

async function initDatabase() {
  const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await query(initSql);
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  getPool,
  query,
  initDatabase,
  closePool,
};
