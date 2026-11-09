const jwt = require('jsonwebtoken');
const { requireAuth } = require('../src/authMiddleware');
const { signToken } = require('../src/auth');

describe('requireAuth', () => {
  function mockRes() {
    const json = jest.fn();
    return { json, status: jest.fn().mockReturnValue({ json }) };
  }

  it('rejeita requisição sem token', () => {
    const res = mockRes();
    const next = jest.fn();

    requireAuth({ headers: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejeita token inválido', () => {
    const res = mockRes();
    const next = jest.fn();

    requireAuth({ headers: { authorization: 'Bearer token-falso' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('aceita JWT válido e preenche req.user', () => {
    const token = signToken({
      email: 'professor@educatech.com',
      name: 'Prof. Amanda Abila Melo',
      role: 'professor',
    });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();

    requireAuth(req, mockRes(), next);

    expect(next).toHaveBeenCalled();
    expect(req.user.email).toBe('professor@educatech.com');
    expect(req.user.role).toBe('professor');
    expect(jwt.decode(token).role).toBe('professor');
  });
});
