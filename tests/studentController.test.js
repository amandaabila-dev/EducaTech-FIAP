const studentService = require('../src/studentService');
const studentController = require('../src/studentController');

jest.mock('../src/studentService');

function mockRes() {
  return {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
  };
}

describe('studentController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('listStudents devolve JSON', async () => {
    studentService.findAll.mockResolvedValue({ items: [] });
    const res = mockRes();

    await studentController.listStudents({ query: {} }, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ items: [] });
  });

  it('createStudent responde 201', async () => {
    studentService.create.mockResolvedValue({ id: 1 });
    const res = mockRes();

    await studentController.createStudent({ body: {} }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('updateStudent devolve aluno', async () => {
    studentService.update.mockResolvedValue({ id: 1, name: 'Lia' });
    const res = mockRes();

    await studentController.updateStudent({ params: { id: 1 }, body: {} }, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Lia' });
  });

  it('deleteStudent responde 204', async () => {
    studentService.delete.mockResolvedValue(undefined);
    const res = mockRes();

    await studentController.deleteStudent({ params: { id: 1 } }, res, jest.fn());

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});
