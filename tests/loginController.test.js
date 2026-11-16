const bcrypt = require('bcryptjs');

jest.mock('../src/teacherRepository');

const teacherRepository = require('../src/teacherRepository');
const loginController = require('../src/loginController');

describe('loginController', () => {
  beforeEach(() => {
    teacherRepository.findByEmail.mockResolvedValue({
      id: 1,
      name: process.env.AUTH_NAME,
      email: process.env.AUTH_EMAIL.toLowerCase(),
      passwordHash: bcrypt.hashSync(process.env.AUTH_PASSWORD, 10),
    });
  });

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
      { body: { email: process.env.AUTH_EMAIL, senha: process.env.AUTH_PASSWORD } },
      { json },
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: 1,
          email: process.env.AUTH_EMAIL.toLowerCase(),
          role: 'professor',
        }),
      })
    );
  });

  it('login rejeita credenciais inválidas', async () => {
    const json = jest.fn();
    const next = jest.fn();

    await loginController.login(
      { body: { email: process.env.AUTH_EMAIL, senha: 'errada' } },
      { json },
      next
    );

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });
});
