const mockEnd = jest.fn().mockResolvedValue(undefined);
const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
const MockPool = jest.fn(() => ({ query: mockQuery, end: mockEnd }));

jest.mock('pg', () => ({ Pool: MockPool }));

describe('connection', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    jest.resetModules();
    MockPool.mockClear();
    mockQuery.mockClear();
    mockEnd.mockClear();
    process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/testdb';
  });

  afterAll(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('cria o pool apenas na primeira query', async () => {
    const connection = require('../src/connection');

    expect(MockPool).not.toHaveBeenCalled();

    await connection.query('SELECT 1');

    expect(MockPool).toHaveBeenCalledTimes(1);
    expect(MockPool).toHaveBeenCalledWith({
      connectionString: 'postgres://test:test@localhost:5432/testdb',
    });
  });

  it('usa DATABASE_URL definido antes da primeira query', async () => {
    delete process.env.DATABASE_URL;

    const connection = require('../src/connection');
    process.env.DATABASE_URL = 'postgres://late:late@localhost:5432/late';

    await connection.query('SELECT 1');

    expect(MockPool).toHaveBeenCalledWith({
      connectionString: 'postgres://late:late@localhost:5432/late',
    });
  });

  it('executa init.sql como fonte única de schema e seed', async () => {
    const connection = require('../src/connection');

    await connection.initDatabase();

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery.mock.calls[0][0]).toContain('CREATE TABLE IF NOT EXISTS posts');
    expect(mockQuery.mock.calls[0][0]).toContain('INSERT INTO posts');
    expect(mockQuery.mock.calls[0][0]).toContain('WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1)');
  });

  it('fecha e libera o pool com closePool', async () => {
    const connection = require('../src/connection');

    await connection.query('SELECT 1');
    await connection.closePool();

    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
