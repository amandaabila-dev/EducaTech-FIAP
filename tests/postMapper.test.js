const {
  normalizePostInput,
  getProvidedPostFields,
  mapPostRow,
  mapPostForRest,
  mapPostsForRest,
} = require('../src/postMapper');

describe('postMapper', () => {
  it('aceita campos da Fase 1 e da Fase 2', () => {
    expect(normalizePostInput({ Titulo: 'Aula', title: 'B' }).titulo).toBe('Aula');
    expect(normalizePostInput({ title: 'REST' }).titulo).toBe('REST');
  });

  it('mapeia registro do banco', () => {
    expect(
      mapPostRow({
        id: 1,
        titulo: 'Aula',
        conteudo: 'Texto',
        responsavel: 'Prof.',
        materia: 'Artes',
        data_criacao: '2026-01-01',
        data_atualizacao: '2026-01-01',
      }).Titulo
    ).toBe('Aula');
  });

  it('mapeia para REST', () => {
    expect(
      mapPostForRest({
        Id: 1,
        Titulo: 'Aula',
        Conteudo: 'Texto',
        Responsavel: 'Prof.',
        Materia: 'Artes',
        DataDeCriacao: '2026-01-01',
        DataDeAtualizacao: '2026-01-01',
      })
    ).toMatchObject({ id: 1, title: 'Aula', author: 'Prof.' });
  });

  it('mapeia lista REST', () => {
    expect(mapPostsForRest([])).toEqual([]);
  });
});
