const loginController = require('../src/loginController');

describe('loginController', () => {
  it('retorna login inativo', () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    loginController.login({}, { json, status });

    expect(status).toHaveBeenCalledWith(503);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ Screen: 'Login', Active: false })
    );
  });
});
