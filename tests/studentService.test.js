jest.mock('../src/studentRepository');

const studentRepository = require('../src/studentRepository');
const studentService = require('../src/studentService');

const existing = {
  id: 4,
  name: 'João',
  email: 'joao@educatechfiap.com.br',
  enrollment: 'RM1',
};

describe('studentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create persiste aluno', async () => {
    studentRepository.create.mockResolvedValue({
      id: 1,
      name: 'Lia',
      email: 'lia@educatechfiap.com.br',
      enrollment: 'RM2',
    });

    const created = await studentService.create({
      name: 'Lia',
      email: 'Lia@Educatechfiap.com.br',
      enrollment: 'RM2',
    });

    expect(created.email).toBe('lia@educatechfiap.com.br');
    expect(studentRepository.create).toHaveBeenCalledWith({
      nome: 'Lia',
      email: 'lia@educatechfiap.com.br',
      matricula: 'RM2',
      materia: null,
    });
  });

  it('create rejeita e-mail inválido e duplicado', async () => {
    await expect(studentService.create({ name: 'A', email: 'x' })).rejects.toMatchObject({
      statusCode: 400,
    });

    studentRepository.create.mockRejectedValue({ code: '23505' });
    await expect(
      studentService.create({ name: 'A', email: 'a@b.com' })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('findAll pagina resultados', async () => {
    studentRepository.findPaginated.mockResolvedValue([existing]);
    studentRepository.count.mockResolvedValue(1);

    await expect(studentService.findAll({})).resolves.toMatchObject({
      total: 1,
      page: 1,
      items: [existing],
    });
  });

  it('findById lança 404', async () => {
    studentRepository.findById.mockResolvedValue(null);
    await expect(studentService.findById(8)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('update mescla campos', async () => {
    studentRepository.findById.mockResolvedValue(existing);
    studentRepository.update.mockResolvedValue({ ...existing, name: 'João Silva' });

    const updated = await studentService.update(4, { name: 'João Silva', enrollment: '' });

    expect(updated.name).toBe('João Silva');
    expect(studentRepository.update).toHaveBeenCalledWith(4, {
      nome: 'João Silva',
      email: 'joao@educatechfiap.com.br',
      matricula: null,
      materia: null,
    });
  });

  it('delete lança 404 se não existir', async () => {
    studentRepository.remove.mockResolvedValue(false);
    await expect(studentService.delete(9)).rejects.toMatchObject({ statusCode: 404 });
  });
});
