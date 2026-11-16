const {
  erro,
  isUniqueViolation,
  parseId,
  parsePagination,
  isValidEmail,
} = require('../src/httpErrors');

describe('httpErrors', () => {
  it('erro lança Error com statusCode', () => {
    expect(() => erro('falhou', 400)).toThrow('falhou');
    try {
      erro('falhou', 400);
    } catch (error) {
      expect(error.statusCode).toBe(400);
    }
  });

  it('isUniqueViolation reconhece código 23505', () => {
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
    expect(isUniqueViolation({ code: '23503' })).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
  });

  it('parseId aceita inteiro positivo e rejeita inválidos', () => {
    expect(parseId('3')).toBe(3);
    expect(() => parseId('abc')).toThrow('ID inválido');
    expect(() => parseId(0, 'Professor')).toThrow('Professor inválido');
  });

  it('parsePagination usa padrões e valida limites', () => {
    expect(parsePagination({})).toBeNull();
    expect(parsePagination({}, { required: true })).toEqual({ page: 1, limit: 10 });
    expect(parsePagination({ page: '2', limit: '5' })).toEqual({ page: 2, limit: 5 });
    expect(() => parsePagination({ page: 0 }, { required: true })).toThrow('Parâmetro page inválido');
    expect(() => parsePagination({ limit: 101 }, { required: true })).toThrow(
      'Parâmetro limit inválido (máximo 100)'
    );
  });

  it('isValidEmail valida formato', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('invalido')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
