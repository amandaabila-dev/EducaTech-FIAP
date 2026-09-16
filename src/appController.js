<<<<<<< HEAD
const { APP } = require('./constants');
const { query } = require('./connection');

function getAppInfo(req, res) {
  res.json({
    application: APP.name,
    description: APP.description,
    mainFlow: APP.mainFlow,
    screens: APP.screens,
    docs: '/api-docs',
  });
}

async function health(req, res) {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', application: APP.name });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', application: APP.name });
  }
}

module.exports = { getAppInfo, health };
=======
const { APP } = require('./constants');
const { query } = require('./connection');

function getAppInfo(req, res) {
  res.json({
    application: APP.name,
    description: APP.description,
    mainFlow: APP.mainFlow,
    screens: APP.screens,
    docs: '/api-docs',
  });
}

async function health(req, res) {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', application: APP.name });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', application: APP.name });
  }
}

module.exports = { getAppInfo, health };
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
