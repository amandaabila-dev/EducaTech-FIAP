const postRepository = require('../src/postRepository');
const postService = require('../src/PostService');

jest.mock('../src/postRepository');

describe('PostService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejeita ID inválido', async () => {
    await expect(postService.findById('abc')).rejects.toMatchObject({
      message: 'ID inválido',
      statusCode: 400,
    });
    expect(postRepository.findById).not.toHaveBeenCalled();
  });

  it('retorna 404 quando post não existe', async () => {
    postRepository.findById.mockResolvedValue(null);
    await expect(postService.findById(999)).rejects.toMatchObject({
      message: 'Post não encontrado',
      statusCode: 404,
    });
  });

  it('cria post com dados válidos', async () => {
    postRepository.create.mockResolvedValue({ Id: 1, Titulo: 'Aula' });
    const result = await postService.create({
      title: 'Aula',
      content: 'Texto',
      author: 'Prof.',
    });
    expect(result.Id).toBe(1);
  });

  it('rejeita criação sem campos obrigatórios', async () => {
    await expect(postService.create({})).rejects.toMatchObject({ statusCode: 400 });
  });

  it('atualiza apenas campos enviados', async () => {
    postRepository.findById.mockResolvedValue({
      Id: 1,
      Titulo: 'Original',
      Conteudo: 'Texto',
      Responsavel: 'Prof.',
      Materia: 'História',
    });
    postRepository.update.mockResolvedValue({ Id: 1, Titulo: 'Novo' });

    await postService.update(1, { title: 'Novo' });

    expect(postRepository.update).toHaveBeenCalledWith(1, {
      titulo: 'Novo',
      conteudo: 'Texto',
      responsavel: 'Prof.',
      materia: 'História',
    });
  });

  it('exclui post existente', async () => {
    postRepository.remove.mockResolvedValue(true);
    await postService.delete(1);
    expect(postRepository.remove).toHaveBeenCalledWith(1);
  });

  it('busca exige termo', async () => {
    await expect(postService.search('')).rejects.toMatchObject({ statusCode: 400 });
  });
});
