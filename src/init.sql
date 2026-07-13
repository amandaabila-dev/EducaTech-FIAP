-- Fonte única de schema e dados iniciais (usada pela API e pelo Docker)

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  responsavel VARCHAR(255) NOT NULL,
  materia VARCHAR(255),
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO posts (titulo, conteudo, responsavel, materia)
SELECT titulo, conteudo, responsavel, materia
FROM (
  VALUES
    (
      'Introdução à Educação Digital na Rede Pública',
      'Material introdutório sobre o uso de plataformas digitais para centralizar conteúdos educacionais entre professores e alunos.',
      'Prof. Ana Silva',
      'Educação Digital'
    ),
    (
      'Matemática Aplicada no Cotidiano',
      'Aula prática com exemplos de matemática para o ensino fundamental, disponibilizada na Home para consulta dos alunos.',
      'Prof. Carlos Mendes',
      'Matemática'
    ),
    (
      'Gestão de Conteúdo com OutSystems',
      'Postagem de referência criada na área administrativa Admin durante a Fase 1 do EducaTech FIAP.',
      'Prof. Amanda Abila Melo',
      'Tecnologia Educacional'
    )
) AS seed(titulo, conteudo, responsavel, materia)
WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1);
