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
      'Introdução ao Desenvolvimento Low-Code com OutSystems',
      $post1$Entenda como acelerar a entrega de aplicações web e mobile utilizando modelagem visual sem abrir mão da escalabilidade e da qualidade de código.

O desenvolvimento tradicional exige horas dedicadas à configuração de ambientes, escrita de código repetitivo (boilerplate) e integração manual entre camadas. O OutSystems surge como uma plataforma low-code de alta produtividade que permite criar aplicações corporativas completas por meio de uma interface visual intuitiva.

No ambiente do Service Studio, você modela a interface do usuário (UI), define fluxos de lógica de negócio, estrutura entidades de banco de dados e consome APIs externas em um único lugar. Por baixo dos panos, a plataforma gera código otimizado em tecnologias padrão de mercado (como React para o front-end e .NET/C# para o back-end), garantindo performance e evitando o bloqueio tecnológico (vendor lock-in).

Principais vantagens na prática:

Velocidade de entrega: Protótipos funcionais em dias, não meses.

Arquitetura padronizada: Facilidade na manutenção e governança de equipes.

Extensibilidade: Possibilidade de inserir código customizado em JavaScript, CSS ou C# sempre que necessário.

Tags: OutSystems, Low-Code, Front-End, Desenvolvimento Ágil$post1$,
      'Prof.ª Mariana Costa',
      'Front-End'
    ),
    (
      'Fundamentos de HTML5 e CSS3 na Prática',
      $post2$Aprenda a estruturar páginas web semânticas e a criar layouts modernos e responsivos utilizando Flexbox e CSS Grid.

Toda página na web começa com dois pilares essenciais: HTML (responsável pela estrutura e significado do conteúdo) e CSS (responsável pela apresentação visual e posicionamento dos elementos).

Com o HTML5, passamos a utilizar tags semânticas como <header>, <nav>, <main>, <article> e <footer>. Além de tornar o código mais legível para quem desenvolve, a semântica melhora o ranqueamento nos mecanismos de busca (SEO) e garante acessibilidade para leitores de tela.

Já no CSS3, recursos modernos eliminaram antigos truques de posicionamento:

Flexbox: Ideal para alinhar elementos em uma única dimensão (linha ou coluna), como barras de navegação e cards centralizados.

CSS Grid: Perfeito para estruturar layouts bidimensionais complexos, controlando linhas e colunas simultaneamente.

Media Queries: Permitem adaptar o visual da aplicação para smartphones, tablets e desktops (Mobile First).

Tags: HTML5, CSS3, Web Design, Responsividade$post2$,
      'Prof. Lucas Andrade',
      'Front-End'
    ),
    (
      'Lógica de Programação e Estruturas Básicas em JavaScript',
      $post3$Dê os primeiros passos na linguagem da web dominando variáveis, condicionais, laços de repetição e funções.

O JavaScript é a linguagem responsável por dar interatividade às páginas web e hoje também atua fortemente no servidor através do Node.js. Antes de partir para frameworks modernos, dominar seus fundamentos é indispensável.

Tudo começa com o armazenamento de dados usando const (para valores constantes) e let (para valores que mudam ao longo da execução). A partir daí, controlamos o fluxo do algoritmo com:

Estruturas condicionais (if / else, switch): Tomam decisões com base em comparações lógicas.

Laços de repetição (for, while, .map(), .forEach()): Automatizam tarefas repetitivas sobre listas de dados (arrays).

Funções: Blocos reutilizáveis de código que recebem parâmetros, processam regras e retornam resultados.

Exemplo prático:

const notas = [8.5, 7.0, 9.2];
const media = notas.reduce((acc, nota) => acc + nota, 0) / notas.length;

if (media >= 7) {
  console.log(`Aprovado com média ${media.toFixed(1)}`);
}

Tags: JavaScript, Lógica de Programação, ES6, Algoritmos$post3$,
      'Prof. Rafael Mendes',
      'Programação'
    ),
    (
      'Como Funcionam as APIs REST na Arquitetura Web',
      $post4$Descubra como diferentes sistemas se comunicam pela internet usando protocolos HTTP, verbos REST e formatos JSON.

Em aplicações modernas, o front-end (o que o usuário vê) e o back-end (onde ficam as regras de negócio e o banco de dados) costumam ser projetos independentes. A ponte que conecta esses dois mundos é a API REST (Representational State Transfer).

Uma API REST utiliza o protocolo HTTP para trocar mensagens leves, geralmente no formato JSON. Cada recurso da aplicação (como /posts ou /usuarios) é acessado por uma URL específica e manipulado por meio dos verbos HTTP:

GET: Busca e lista informações sem alterá-las.

POST: Cria um novo registro no servidor.

PUT / PATCH: Atualiza um registro existente (total ou parcialmente).

DELETE: Remove um registro do sistema.

Além disso, os códigos de status HTTP informam rapidamente o resultado da operação: 200 OK para sucesso, 201 Created para criação, 400 Bad Request para erros de validação e 404 Not Found quando o recurso não existe.

Tags: API REST, Back-End, HTTP, JSON, Arquitetura$post4$,
      'Prof.ª Camila Nogueira',
      'Back-End'
    ),
    (
      'Primeiros Passos com SQL: Consultas e Modelagem Relacional',
      $post5$Aprenda a organizar informações em tabelas relacionadas e a extrair dados precisos utilizando comandos SQL.

Bancos de dados relacionais, como o PostgreSQL, organizam informações em tabelas compostas por linhas (registros) e colunas (atributos). Para evitar duplicidade e manter a integridade dos dados, utilizamos Chaves Primárias (PRIMARY KEY) para identificar cada registro de forma única e Chaves Estrangeiras (FOREIGN KEY) para conectar tabelas diferentes — como vincular várias postagens a um único autor.

Para interagir com esses dados, utilizamos a linguagem SQL (Structured Query Language). Os comandos mais utilizados no dia a dia são:

SELECT e WHERE: Filtram e retornam exatamente as colunas e linhas desejadas.

JOIN: Combina dados de duas ou mais tabelas relacionadas em uma única consulta.

INSERT, UPDATE e DELETE: Inserem, alteram e excluem registros.

Exemplo de consulta:

SELECT p.titulo, c.nome AS categoria
FROM posts p
INNER JOIN categorias c ON p.categoria_id = c.id
WHERE p.publicado = true
ORDER BY p.criado_em DESC;

Tags: SQL, PostgreSQL, Banco de Dados, Modelagem$post5$,
      'Prof. Thiago Barbosa',
      'Banco de Dados'
    ),
    (
      'Controle de Versão na Prática com Git e GitHub',
      $post6$Saiba como registrar o histórico do seu código, trabalhar em equipe sem conflitos e gerenciar repositórios remotos.

Desenvolver software sem controle de versão é como escrever um livro sem poder desfazer alterações ou comparar rascunhos. O Git é um sistema de controle de versão distribuído que registra cada modificação feita nos arquivos do seu projeto ao longo do tempo.

Enquanto o Git roda localmente na sua máquina, o GitHub atua como plataforma na nuvem para hospedar seus repositórios, revisar códigos e colaborar com outras pessoas.

Fluxo essencial de trabalho:

git clone: Baixa uma cópia completa de um repositório remoto.

git checkout -b feature/nova-tela: Cria uma ramificação (branch) isolada para desenvolver uma funcionalidade sem quebrar o código principal (main).

git add . e git commit -m "feat: adiciona filtro de busca": Salva um ponto de restauração com uma mensagem descritiva.

git push: Envia suas alterações locais para o GitHub, permitindo abrir um Pull Request para revisão da equipe.

Tags: Git, GitHub, DevOps, Controle de Versão$post6$,
      'Prof. Bruno Ferreira',
      'DevOps'
    )
) AS seed(titulo, conteudo, responsavel, materia)
WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1);

CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  matricula VARCHAR(50),
  materia VARCHAR(255),
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE students ADD COLUMN IF NOT EXISTS materia VARCHAR(255);

INSERT INTO students (nome, email, matricula, materia)
SELECT nome, email, matricula, materia
FROM (
  VALUES
    ('Ana Beatriz Lima', 'ana.lima@educatechfiap.com.br', 'RM550112', 'Front-End'),
    ('Carlos Eduardo Souza', 'carlos.souza@educatechfiap.com.br', 'RM550228', 'Front-End'),
    ('Fernanda Oliveira', 'fernanda.oliveira@educatechfiap.com.br', 'RM550341', 'Programação'),
    ('João Pedro Almeida', 'joao.almeida@educatechfiap.com.br', 'RM550456', 'Programação'),
    ('Larissa Martins', 'larissa.martins@educatechfiap.com.br', 'RM550567', 'Back-End'),
    ('Marcos Vinícius Rocha', 'marcos.rocha@educatechfiap.com.br', 'RM550678', 'Back-End'),
    ('Patrícia Nunes', 'patricia.nunes@educatechfiap.com.br', 'RM550789', 'Banco de Dados'),
    ('Rafael Costa Silva', 'rafael.silva@educatechfiap.com.br', 'RM550890', 'Banco de Dados'),
    ('Sofia Mendes', 'sofia.mendes@educatechfiap.com.br', 'RM550901', 'DevOps'),
    ('Thiago Henrique Dias', 'thiago.dias@educatechfiap.com.br', 'RM551014', 'DevOps')
) AS seed(nome, email, matricula, materia)
WHERE NOT EXISTS (SELECT 1 FROM students LIMIT 1);
