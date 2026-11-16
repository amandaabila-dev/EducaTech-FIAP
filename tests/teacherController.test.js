const teacherService = require('../src/teacherService');
const teacherController = require('../src/teacherController');

jest.mock('../src/teacherService');

function mockRes() {
  return {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
  };
}

describe('teacherController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('listTeachers devolve JSON', async () => {
    teacherService.findAll.mockResolvedValue({ items: [] });
    const res = mockRes();

    await teacherController.listTeachers({ query: { page: 1 } }, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ items: [] });
  });

  it('createTeacher responde 201', async () => {
    teacherService.create.mockResolvedValue({ id: 1 });
    const res = mockRes();

    await teacherController.createTeacher({ body: {} }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('deleteTeacher responde 204', async () => {
    teacherService.delete.mockResolvedValue(undefined);
    const res = mockRes();

    await teacherController.deleteTeacher({ params: { id: 1 }, user: { id: 2 } }, res, jest.fn());

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it('encaminha erro para next', async () => {
    const error = new Error('falha');
    teacherService.findById.mockRejectedValue(error);
    const next = jest.fn();

    await teacherController.getTeacherById({ params: { id: 1 } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
