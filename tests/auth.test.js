const bcrypt = require('bcryptjs');

jest.mock('../src/teacherRepository');

const teacherRepository = require('../src/teacherRepository');
const { authenticate, signToken, verifyToken } = require('../src/auth');

describe('auth', () => {
  it('authenticate devolve professor do banco', async () => {
    teacherRepository.findByEmail.mockResolvedValue({
      id: 11,
      name: 'Ana',
      email: process.env.AUTH_EMAIL.toLowerCase(),
      passwordHash: bcrypt.hashSync(process.env.AUTH_PASSWORD, 4),
    });

    const user = await authenticate(process.env.AUTH_EMAIL, process.env.AUTH_PASSWORD);

    expect(user).toEqual({
      id: 11,
      email: process.env.AUTH_EMAIL.toLowerCase(),
      name: 'Ana',
      role: 'professor',
    });
  });

  it('authenticate rejeita professor inexistente', async () => {
    teacherRepository.findByEmail.mockResolvedValue(null);

    await expect(authenticate('ninguém@educatechfiap.com.br', 'x')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('signToken inclui id e role', () => {
    const token = signToken({
      id: 11,
      email: 'ana@educatechfiap.com.br',
      name: 'Ana',
      role: 'professor',
    });
    expect(verifyToken(token)).toMatchObject({ id: 11, role: 'professor' });
  });
});
