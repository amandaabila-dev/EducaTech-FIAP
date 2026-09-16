<<<<<<< HEAD
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
=======
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
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
