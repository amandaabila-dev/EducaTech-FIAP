const APP = {
  name: 'EducaTechFIAP',
  description: 'Acesso restrito a professores e mestres.',
  mainFlow: 'MainFlow',
  profiles: { aluno: 'Aluno', professor: 'Professor' },
  screens: {
    home: 'Home',
    postPage: 'PostPage',
    login: 'Login',
    admin: 'Admin',
    newPost: 'NewPost',
    postEdition: 'PostEdition',
    postDeletion: 'PostDeletion',
    postSearch: 'PostSearch',
  },
  pageTitles: {
    home: 'Home',
    postPage: 'Postagem',
    admin: 'Área do Professor',
    newPost: 'Nova Postagem',
    postEdition: 'Edição de Postagem',
    postDeletion: 'Exclusão de Postagem',
    postSearch: 'Busca de Postagens',
    login: 'Login',
  },
  login: {
    active: false,
    message: 'Login inativo na Fase 1. Acesso direto à Área do Professor (Admin).',
    labels: {
      novaPostagem: 'Nova Postagem',
      salvar: 'Salvar',
      voltar: 'Voltar',
      cancelar: 'Cancelar',
      areaDoProfessor: 'Área do Professor',
      email: 'E-mail:',
      senha: 'Senha:',
      esqueciSenha: 'Esqueci a senha',
    },
  },
};

function buildUiFlowResponse(screen, profile, pageTitle, extra = {}) {
  return {
    Application: APP.name,
    MainFlow: APP.mainFlow,
    Screen: screen,
    Profile: profile,
    PageTitle: pageTitle,
    ...extra,
  };
}

module.exports = { APP, buildUiFlowResponse };
