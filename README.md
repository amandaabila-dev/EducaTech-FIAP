# EducaTech FIAP — Tech Challenge Fase 2

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?logo=jest)

API REST de blogging educacional — refatoração do back-end da **Fase 1 (OutSystems)** para **Node.js + PostgreSQL**.

> **Somente back-end.** Sem telas HTML. UI Flows (`/Home`, `/Admin`…) retornam JSON no formato OutSystems. Front-end visual: Fase 1 (OutSystems) e Fase 3.

**Stack:** Node.js 20, Express, PostgreSQL 16, Docker, Jest, Swagger UI, GitHub Actions.

**Autenticação:** não implementada (login inativo, conforme Fase 1).

---

## Estrutura

Arquitetura **MVC**: `routes` → `controllers` → `services` → `repositories` → PostgreSQL.

Não versionados: `node_modules/`, `coverage/`, `.env`, `local/`.

---

## API

### REST (`/posts`) — formato camelCase

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/posts` | Lista (ou `?page=1&limit=10`) |
| GET | `/posts/search?q=` | Busca por título, conteúdo, matéria ou autor |
| GET | `/posts/:id` | Por ID |
| POST | `/posts` | Cria |
| PUT | `/posts/:id` | Atualiza (parcial) |
| DELETE | `/posts/:id` | Remove (204) |

### UI Flows — formato OutSystems

| Rota | Tela |
|------|------|
| `GET /Home` | Lista (aluno) |
| `GET /PostPage/:id` | Detalhe (aluno) |
| `GET /Admin` | Área do professor |
| `POST /NewPost` | Criar |
| `PUT /PostEdition/:id` | Editar |
| `DELETE /PostDeletion/:id` | Excluir |
| `GET /PostSearch?q=` | Busca |
| `GET /Login` | Inativo (503) |

### Utilitários

`GET /` · `GET /health` · `GET /api-docs`

---

## Exemplo

```http
POST http://localhost:3000/posts
Content-Type: application/json

{ "title": "Nova aula", "content": "Texto.", "author": "Prof. Ana" }
```

```http
GET http://localhost:3000/Admin
```

---

## Testes

```powershell
npm test                 # todos (~47 testes, ~94% cobertura)
npm run test:docker      # via Docker (sem Node local)
```

Integração usa PostgreSQL real (`tests/integration/`). Unitários em `tests/unit/`.

CI (`.github/workflows/ci.yml`): testes + build Docker na branch `main`.

---

Projeto acadêmico — FIAP Pós Tech (Full Stack Development).
