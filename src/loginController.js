const { APP } = require('./constants');
const { authenticate, signToken } = require('./auth');

function getLoginScreen(req, res) {
  res.json({
    Application: APP.name,
    MainFlow: APP.mainFlow,
    Screen: APP.screens.login,
    Profile: APP.profiles.professor,
    PageTitle: APP.pageTitles.login,
    Active: APP.login.active,
    Message: APP.login.message,
    Labels: APP.login.labels,
    Endpoint: '/login',
  });
}

async function login(req, res, next) {
  try {
    const email = req.body?.email;
    const senha = req.body?.senha ?? req.body?.password;
    const user = await authenticate(email, senha);
    const token = signToken(user);

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLoginScreen, login };
