<<<<<<< HEAD
const { APP } = require('./constants');

function login(req, res) {
  res.status(503).json({
    Application: APP.name,
    MainFlow: APP.mainFlow,
    Screen: APP.screens.login,
    Profile: APP.profiles.professor,
    PageTitle: APP.pageTitles.login,
    Active: APP.login.active,
    Message: APP.login.message,
    Labels: APP.login.labels,
  });
}

module.exports = { login };
=======
const { APP } = require('./constants');

function login(req, res) {
  res.status(503).json({
    Application: APP.name,
    MainFlow: APP.mainFlow,
    Screen: APP.screens.login,
    Profile: APP.profiles.professor,
    PageTitle: APP.pageTitles.login,
    Active: APP.login.active,
    Message: APP.login.message,
    Labels: APP.login.labels,
  });
}

module.exports = { login };
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
