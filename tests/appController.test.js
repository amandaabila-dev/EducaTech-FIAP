jest.mock('../src/connection', () => ({ query: jest.fn() }));

const { query } = require('../src/connection');
const appController = require('../src/appController');

describe('appController', () => {
  it('getAppInfo retorna dados da aplicação', () => {
    const json = jest.fn();
    appController.getAppInfo({}, { json });
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ application: 'EducaTechFIAP' }));
  });

  it('health retorna ok com banco conectado', async () => {
    query.mockResolvedValue({ rows: [{}] });
    const json = jest.fn();
    await appController.health({}, { json, status: jest.fn().mockReturnValue({ json }) });
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ status: 'ok' }));
  });
});
