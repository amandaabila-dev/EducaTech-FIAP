# EducaTech FIAP — Tech Challenge Fase 3

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled_Components-6-DB7093?logo=styledcomponents&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

Interface gráfica em **React** para a plataforma de blogging educacional EducaTech, consumindo a API REST criada na Fase 2.

- **Fase 1:** front-end em OutSystems.
- **Fase 2:** back-end em Node.js + PostgreSQL (incluído nesta pasta, sem alterações de regra de negócio).
- **Fase 3 (este projeto):** front-end React responsivo consumindo os endpoints REST.

**Stack do front-end:** React 18, Vite 5, React Router 6, Styled Components 6, Context API.

---

## Estrutura

```
(raiz = back-end da Fase 2)
├── src/                      # API Express (rotas, controllers, service, repository)
├── tests/                    # Testes Jest do back-end
├── Dockerfile                # Imagem da API
├── docker-compose.yml        # db + api + web (+ perfil de testes)
├── .github/workflows/ci.yml  # CI: testes, build do front-end e build das imagens
└── frontend/                 # Front-end React (Fase 3)
    ├── index.html
    ├── vite.config.js        # Proxy /api → http://localhost:3000
    ├── Dockerfile            # Build Vite + Nginx
    ├── nginx.conf            # Fallback SPA + proxy /api → api:3000
    └── src/
        ├── main.jsx          # ThemeProvider, GlobalStyle, Router, AuthProvider
        ├── App.jsx           # Mapa de rotas e layout
        ├── pages/            # HomePage, PostPage, LoginPage, AdminPage, Create/EditPostPage, NotFoundPage
        ├── components/       # Header, Footer, PostCard, SearchBar, PostForm, ProtectedRoute…
        ├── contexts/         # AuthContext (login do professor)
        ├── services/api.js   # Chamadas REST
        ├── styles/           # theme.js, GlobalStyle.js, ui.js (componentes reutilizáveis)
        └── utils/format.js   # Datas e resumos de texto
```

Não versionados: `node_modules/`, `coverage/`, `frontend/dist/`, `.env`, `local/`.

---

## Setup inicial

Pré-requisitos: **Docker** (caminho recomendado) ou **Node.js 20+**.

### Opção 1 — Tudo via Docker

```powershell
copy .env.example .env
docker compose up --build
```

| Serviço | Endereço |
|---------|----------|
| Front-end React | http://localhost:8080 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |
| PostgreSQL | localhost:5432 |

No Docker, o Nginx serve o build do React e encaminha `/api/*` para o contêiner da API — não é preciso configurar CORS nem URLs.

### Opção 2 — Desenvolvimento local

Suba o banco e a API (terminal 1):

```powershell
copy .env.example .env
npm install
docker compose up -d db      # ou um PostgreSQL local já existente
npm start
```

Suba o front-end (terminal 2):

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

O front-end fica em http://localhost:5173 e o Vite faz proxy de `/api` para a API na porta 3000.

### Variáveis de ambiente do front-end (`frontend/.env`)

| Variável | Padrão | Função |
|----------|--------|--------|
| `VITE_API_URL` | `/api` | URL base da API usada pelo `services/api.js` |
| `BACKEND_URL` | `http://localhost:3000` | Destino do proxy do Vite em desenvolvimento |
| `VITE_AUTH_EMAIL` | `professor@educatech.com` | E-mail aceito no login |
| `VITE_AUTH_PASSWORD` | `educatech123` | Senha aceita no login |
| `VITE_AUTH_NAME` | `Prof. Amanda Abila Melo` | Nome exibido no cabeçalho |

Sem arquivo `.env` a aplicação usa esses padrões e funciona normalmente.

---

## Arquitetura da aplicação

Detalhes de **personas**, **user flows** (Mermaid) e **style guide** (cores, tipografia, breakpoints) estão em [`DOCUMENTACAO.md`](DOCUMENTACAO.md) — alinhados às aulas de UI/UX da Fase 3.

```
Navegador → React Router → Páginas → services/api.js → API Express → PostgreSQL
                              ↓
                        AuthContext (localStorage)
```

| Camada | Onde fica | Responsabilidade |
|--------|-----------|------------------|
| Roteamento | `src/App.jsx` | Define as rotas e envolve as privadas em `ProtectedRoute` |
| Páginas | `src/pages/` | Buscam dados, controlam carregamento e erro |
| Componentes | `src/components/` | Blocos reutilizáveis de interface |
| Estado global | `src/contexts/AuthContext.jsx` | Sessão do professor via Context API |
| Comunicação | `src/services/api.js` | Único ponto que fala com a API |
| Estilo | `src/styles/` | Tema, reset global e componentes estilizados comuns |

Todas as telas usam **componentes funcionais e hooks** (`useState`, `useEffect`, `useContext` e hooks do React Router).

### Rotas e endpoints

| Rota do front-end | Acesso | Endpoints usados |
|-------------------|--------|------------------|
| `/` | Público | `GET /posts`, `GET /posts/search?q=` |
| `/posts/:id` | Público | `GET /posts/:id` |
| `/login` | Público | — (validação local) |
| `/admin` | Professor | `GET /posts`, `DELETE /posts/:id` |
| `/admin/posts/novo` | Professor | `POST /posts` |
| `/admin/posts/:id/editar` | Professor | `GET /posts/:id`, `PUT /posts/:id` |

Formato dos posts na API: `id`, `title`, `content`, `author`, `subject`, `createdAt`, `updatedAt`. Erros chegam como `{ "error": "mensagem" }` e são exibidos na tela.

### Autenticação e autorização

O back-end da Fase 2 não possui login (a rota `/Login` responde 503). A autenticação foi implementada **no front-end**:

- `AuthContext` valida e-mail e senha contra as variáveis `VITE_AUTH_*` e grava a sessão em `localStorage`.
- `ProtectedRoute` redireciona quem não está autenticado para `/login`, guardando a rota de origem para voltar depois do login.
- O cabeçalho alterna entre "Entrar" e o bloco "Área do Professor / Nova Postagem / Sair".

> Por ser validação apenas no cliente, o objetivo é controlar a navegação, não proteger a API. Uma autenticação real (JWT no back-end) fica como evolução natural do projeto.

### Estilização e responsividade

Styled Components com `ThemeProvider` (tokens em `styles/theme.js`) e `createGlobalStyle`. Tipografia: stack de sistema (`Segoe UI`, Roboto, Arial…) — escolha documentada no style guide da `DOCUMENTACAO.md`, sem fontes externas. Layout responsivo: grade em coluna no mobile, menu colapsável, tabela admin com rolagem horizontal. Acessibilidade: HTML semântico, `label` nos campos, foco visível, `aria-label` nas ações.

---

## Guia de uso

**Aluno (sem login)**

1. Abra http://localhost:8080 (Docker) ou http://localhost:5173 (dev).
2. A página inicial lista as postagens com título, autor, matéria, data e um resumo.
3. Digite no campo de busca e clique em **Buscar** (ou pressione Enter) para filtrar; **Limpar** volta à lista completa.
4. Clique em "Ler postagem" para ver o conteúdo completo.

**Professor**

1. Clique em "Entrar" e informe as credenciais de demonstração:
   - E-mail: `professor@educatech.com`
   - Senha: `educatech123`
2. Em "Área do Professor" você vê todas as postagens em tabela, com ações de editar e excluir (a exclusão pede confirmação).
3. "Nova Postagem" abre o formulário com título, autor, matéria (opcional) e conteúdo.
4. "Editar" carrega os dados atuais do post para alteração.
5. "Sair" encerra a sessão e volta para a página inicial.

---

## Testes e CI

```powershell
npm test                 # testes do back-end (Jest + PostgreSQL)
npm run test:docker      # mesmos testes dentro do Docker
npm run frontend:build   # valida o build de produção do front-end
```

O workflow `.github/workflows/ci.yml` roda três jobs na branch `main`: testes do back-end com PostgreSQL como service container, build do front-end e build das duas imagens Docker.

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| Front-end carrega mas não mostra posts | Confira se a API está no ar em http://localhost:3000/health |
| `Não foi possível conectar à API` | Suba o back-end (`npm start`) ou use `docker compose up` |
| Porta 8080 ocupada | Altere o mapeamento do serviço `web` no `docker-compose.yml` |
| Alterações no `.env` do front-end não aplicaram | Reinicie o `npm run dev` (o Vite lê as variáveis na inicialização) |
| Dados/schema antigos no banco | `docker compose down -v && docker compose up --build` |

---

## Equipe

| Nome | RM |
|------|----|
| Amanda Abila Melo | 373430 |

Projeto acadêmico — FIAP Pós Tech (Full Stack Development).
