jest.mock('../src/teacherRepository');

const teacherRepository = require('../src/teacherRepository');
const teacherService = require('../src/teacherService');

const existing = {
  id: 2,
  name: 'Ana',
  email: 'ana@educatechfiap.com.br',
  passwordHash: 'hash',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('teacherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    teacherRepository.SALT_ROUNDS = 4;
  });

  it('create valida campos e persiste professor', async () => {
    teacherRepository.create.mockResolvedValue({ id: 3, name: 'Bia', email: 'bia@educatechfiap.com.br' });

    const created = await teacherService.create({
      name: 'Bia',
      email: 'Bia@Educatechfiap.com.br',
      password: 'senha123',
    });

    expect(created.email).toBe('bia@educatechfiap.com.br');
    expect(teacherRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Bia',
        email: 'bia@educatechfiap.com.br',
        senhaHash: expect.any(String),
      })
    );
  });

  it('create rejeita senha curta e e-mail inválido', async () => {
    await expect(teacherService.create({ name: 'A', email: 'x', password: '123456' })).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(
      teacherService.create({ name: 'A', email: 'a@b.com', password: '123' })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('create mapeia e-mail duplicado para 409', async () => {
    teacherRepository.create.mockRejectedValue({ code: '23505' });

    await expect(
      teacherService.create({ name: 'A', email: 'a@b.com', password: '123456' })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('findAll devolve página', async () => {
    teacherRepository.findPaginated.mockResolvedValue([existing]);
    teacherRepository.count.mockResolvedValue(1);

    const result = await teacherService.findAll({ page: 1, limit: 10 });

    expect(result).toMatchObject({ items: [existing], page: 1, limit: 10, total: 1, totalPages: 1 });
    expect(teacherRepository.findPaginated).toHaveBeenCalledWith(1, 10, '');
  });

  it('findAll filtra professores pela matéria que lecionam', async () => {
    teacherRepository.findPaginated.mockResolvedValue([]);
    teacherRepository.count.mockResolvedValue(0);

    await teacherService.findAll({ page: 1, limit: 8, subject: 'Front-End' });

    expect(teacherRepository.findPaginated).toHaveBeenCalledWith(1, 8, 'Front-End');
    expect(teacherRepository.count).toHaveBeenCalledWith('Front-End');
  });

  it('findById lança 404', async () => {
    teacherRepository.findById.mockResolvedValue(null);
    await expect(teacherService.findById(9)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('update altera nome e senha', async () => {
    teacherRepository.findById.mockResolvedValue(existing);
    teacherRepository.update.mockResolvedValue({ ...existing, name: 'Ana Clara' });

    const updated = await teacherService.update(2, { name: 'Ana Clara', password: 'novaSenha' });

    expect(updated.name).toBe('Ana Clara');
    expect(teacherRepository.update).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ nome: 'Ana Clara', email: 'ana@educatechfiap.com.br' })
    );
  });

  it('update rejeita payload vazio', async () => {
    await expect(teacherService.update(2, {})).rejects.toMatchObject({ statusCode: 400 });
  });

  it('delete impede autoexclusão e último professor', async () => {
    await expect(teacherService.delete(2, { id: 2 })).rejects.toMatchObject({ statusCode: 400 });

    teacherRepository.count.mockResolvedValue(1);
    await expect(teacherService.delete(2, { id: 1 })).rejects.toMatchObject({ statusCode: 400 });
  });

  it('delete remove quando há mais de um professor', async () => {
    teacherRepository.count.mockResolvedValue(2);
    teacherRepository.remove.mockResolvedValue(true);

    await teacherService.delete(2, { id: 1 });
    expect(teacherRepository.remove).toHaveBeenCalledWith(2);
  });
});
