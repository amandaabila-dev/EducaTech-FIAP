const errorHandler = require('../src/errorHandler');

describe('errorHandler', () => {
  it('oculta detalhes de erro 500', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const err = new Error('falha interna');
    err.statusCode = 500;

    errorHandler(err, { method: 'GET', originalUrl: '/posts' }, { json, status }, jest.fn());

    expect(json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    consoleError.mockRestore();
  });

  it('retorna mensagem para erros 4xx', () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const err = new Error('ID inválido');
    err.statusCode = 400;

    errorHandler(err, { method: 'GET', originalUrl: '/posts/abc' }, { json, status }, jest.fn());

    expect(json).toHaveBeenCalledWith({ error: 'ID inválido' });
  });
});
