# EducaTech FIAP

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-Expo_52-000020?logo=expo)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

Plataforma educacional para professores publicarem conteúdos e alunos lerem e filtrarem postagens. O repositório reúne **API REST**, **front-end web** e **app mobile**, todos falando com o mesmo PostgreSQL.

**Web:** React 18, Vite, React Router, Styled Components, Context API.  
**Mobile:** Expo 52, React Navigation, Context API, AsyncStorage.  
**API:** Node.js, Express, JWT, PostgreSQL.

---

## O que o sistema faz

- Visitantes e alunos leem postagens, buscam por palavra-chave e filtram por matéria (a tag da postagem também filtra a lista).
- Professores autenticam com e-mail e senha, publicam e editam conteúdos, e cadastram docentes e alunos.
- Cada professor na lista mostra as matérias que leciona (derivadas das postagens). Alunos têm matéria inscrita e filtro correspondente.
- E-mails institucionais usam o domínio `@educatechfiap.com.br`.

---

## Estrutura do código

```
├── src/                 # API Express (posts, teachers, students, login)
├── tests/               # Jest da API
├── frontend/            # SPA React (Vite)
├── mobile/              # App Expo / React Native
├── docker-compose.yml   # PostgreSQL + API + web
└── .github/workflows/   # CI (testes da API, build do web e das imagens)
```

Detalhes do app móvel: [`mobile/README.md`](mobile/README.md).

Não versionar: `node_modules/`, `coverage/`, `frontend/dist/`, `mobile/.expo/`, `.env` (copie de `.env.example`).

---

## Como rodar

Pré-requisitos: **Docker** ou **Node.js 20+**.

### Docker (API + web)

```powershell
copy .env.example .env
# preencha JWT_SECRET, AUTH_EMAIL e AUTH_PASSWORD
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Web | http://localhost:8080 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |
| PostgreSQL | localhost:5432 |

O Nginx do front-end encaminha `/api/*` para a API.

### Desenvolvimento local

Terminal 1 — banco e API:

```powershell
copy .env.example .env
npm install
docker compose up -d db
npm start
```

Terminal 2 — web:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Web em http://localhost:5173 (proxy `/api` → porta 3000).

Terminal 3 — mobile (API já no ar):

```powershell
cd mobile
copy .env.example .env
# ajuste EXPO_PUBLIC_API_URL (IP da máquina no Expo Go)
npm install
npx expo start
```

### Variáveis de ambiente

API (`.env` na raiz):

| Variável | Obrigatória | Função |
|----------|-------------|--------|
| `JWT_SECRET` | Sim | Assinatura do JWT (só no servidor) |
| `JWT_EXPIRES_IN` | Não (`8h`) | Validade do token |
| `AUTH_EMAIL` | Sim | E-mail do professor inicial (inserido em `teachers` se ainda não existir) |
| `AUTH_PASSWORD` | Sim | Senha desse professor |
| `AUTH_NAME` | Não | Nome do professor inicial |

Front-end (`frontend/.env`):

| Variável | Padrão | Função |
|----------|--------|--------|
| `VITE_API_URL` | `/api` | Base da API no cliente |
| `BACKEND_URL` | `http://localhost:3000` | Destino do proxy do Vite |

A API não sobe sem `JWT_SECRET`, `AUTH_EMAIL` e `AUTH_PASSWORD`. Esses valores não vão para o cliente (`VITE_` / `EXPO_PUBLIC_`).

---

## Arquitetura

```
Navegador / Expo Go → telas → services/api.js → Express → PostgreSQL
                                    ↓                    ↑
                              AuthContext (JWT)    POST /login + requireAuth
```

| Parte | Onde | Papel |
|-------|------|--------|
| API | `src/` | Rotas, JWT, persistência |
| Web | `frontend/src/` | Páginas, `AuthContext`, `services/api.js`, tema |
| Mobile | `mobile/src/` | Telas, navegação, `AuthContext`, `services/api.js`, tema |

Telas são componentes funcionais com hooks.

### API

Leitura de posts é pública. Escrita de posts, professores e alunos exige `Authorization: Bearer <token>`.

| Recurso | Endpoints |
|---------|-----------|
| Postagens | `GET/POST /posts`, `GET/PUT/DELETE /posts/:id`, `GET /posts/search?q=&subject=` |
| Login | `POST /login` |
| Professores | `GET/POST /teachers`, `GET/PUT/DELETE /teachers/:id` (`?page=&limit=&subject=`) |
| Alunos | `GET/POST /students`, `GET/PUT/DELETE /students/:id` (mesma paginação e `subject`) |

Respostas REST em inglês: posts (`id`, `title`, `content`, `author`, `subject`, `createdAt`, `updatedAt`); professores (`id`, `name`, `email`, `subjects`, …); alunos (`id`, `name`, `email`, `enrollment`, `subject`, …). Senha nunca retorna. Erro: `{ "error": "mensagem" }`.

Há também rotas no formato OutSystems (`/Home`, `/Admin`, `/NewPost`, …) usadas pela API original.

### Autenticação

- `POST /login` consulta a tabela `teachers` e devolve `{ token, user }` com `role: "professor"`.
- Na primeira subida, o professor de `AUTH_EMAIL` / `AUTH_PASSWORD` é criado se ainda não existir. Docentes das postagens também são semeados (senha `senha123`).
- Web guarda o JWT em `localStorage`; mobile, em `AsyncStorage`.
- Rotas privadas no web usam `ProtectedRoute`; no mobile, `ProtectedScreen` e abas Admin / Professores / Alunos só aparecem logado.

### Interface

Tema compartilhado: magenta FIAP (`#ED145B`), marinho e verde-água (`frontend/src/styles/theme.js` e `mobile/src/theme.js`). Web é responsivo (menu colapsável, grade e tabela com rolagem). Ações de editar/excluir usam ícones.

---

## Uso

**Sem login:** lista, busca, filtro por matéria e leitura do conteúdo.

**Com login de professor:** administração de postagens; no mobile, também CRUD paginado de professores e alunos, com filtro por matéria.

---

## Testes e CI

```powershell
npm test                 # Jest da API (precisa do PostgreSQL)
npm run test:docker      # mesmos testes no Compose
npm run frontend:build   # build de produção do web
npm run mobile:start     # Expo (API precisa estar no ar)
```

O workflow em `.github/workflows/ci.yml` testa a API, faz build do web e das imagens Docker.

Versionar só `.env.example`. O `.env` com JWT e senha fica de fora.

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| Web sem postagens | API em http://localhost:3000/health |
| `Não foi possível conectar à API` | `npm start` na raiz ou `docker compose up` |
| Porta 8080 ocupada | Ajuste o serviço `web` no `docker-compose.yml` |
| `.env` do Vite não aplicou | Reinicie `npm run dev` |
| 401 ao editar | Faça login de novo; o JWT pode ter expirado |
| Schema antigo no banco | `docker compose down -v && docker compose up --build` |
| Expo Go não alcança a API | IPv4 do PC em `EXPO_PUBLIC_API_URL` e porta 3000 liberada no firewall |

---

## Equipe

| Nome | RM |
|------|----|
| Amanda Abila Melo | 373430 |

FIAP Pós Tech — Full Stack Development.
