const loginController = require('../src/loginController');

describe('loginController', () => {
  it('getLoginScreen retorna login ativo', () => {
    const json = jest.fn();

    loginController.getLoginScreen({}, { json });

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ Screen: 'Login', Active: true, Endpoint: '/login' })
    );
  });

  it('login autentica e devolve token', async () => {
    const json = jest.fn();
    const next = jest.fn();

    await loginController.login(
      { body: { email: 'professor@educatech.com', senha: 'educatech123' } },
      { json },
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: 'professor@educatech.com',
          role: 'professor',
        }),
      })
    );
  });

  it('login rejeita credenciais inválidas', async () => {
    const json = jest.fn();
    const next = jest.fn();

    await loginController.login(
      { body: { email: 'professor@educatech.com', senha: 'errada' } },
      { json },
      next
    );

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });
});
