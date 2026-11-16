# EducaTech Mobile

App **React Native (Expo)** da plataforma EducaTech. Consome a mesma API REST do restante do repositório.

Visitantes leem e filtram postagens sem conta. Professores entram com JWT e gerenciam posts, docentes e alunos.

**Stack:** Expo SDK 52, React 18, React Navigation, Context API, AsyncStorage.

O panorama do projeto (API, web e banco) está no [README da raiz](../README.md).

## Como rodar

1. Suba a API na raiz do repositório (`npm start`, com PostgreSQL no ar). Ela escuta em `0.0.0.0:3000`.

2. Instale o [Expo Go](https://expo.dev/go).

3. No app:

```powershell
cd mobile
copy .env.example .env
# ajuste EXPO_PUBLIC_API_URL
npm install
npx expo start
```

Leia o QR code no Expo Go.

### `EXPO_PUBLIC_API_URL`

| Onde o app roda | Valor típico |
|-----------------|--------------|
| Emulador Android | `http://10.0.2.2:3000` |
| Expo Go no celular (mesma Wi-Fi) | `http://IP_DO_PC:3000` |
| Simulador iOS | `http://localhost:3000` |

No Windows, o IPv4 aparece em `ipconfig`. Reinicie o Expo depois de mudar o `.env`. O celular não usa o proxy do Vite: a URL precisa ser alcançável na rede e a porta 3000 liberada no firewall.

## Código

```
Expo Go → telas → AuthContext → services/api.js → API Express → PostgreSQL
```

| Camada | Pasta | Papel |
|--------|--------|--------|
| Navegação | `src/navigation/RootNavigator.jsx` | Aba Postagens sempre visível; Admin / Professores / Alunos só com JWT. Formulários em stack (`ProtectedScreen`) |
| Telas | `src/screens/` | Home, leitura, login, admin de posts e formulários. Listas de pessoas em `PeopleListScreen` |
| Estado | `src/contexts/AuthContext.jsx` | Sessão do professor no AsyncStorage |
| API | `src/services/api.js` | Único cliente REST (Bearer nas rotas protegidas) |
| Tema | `src/theme.js` | Magenta FIAP (`#ED145B`), marinho e verde-água |

Componentes funcionais com hooks (`useState`, `useEffect`, `useFocusEffect`, `useAuth`).

### Telas

| Tela | Acesso | Endpoints |
|------|--------|-----------|
| Home | Público | `GET /posts`, `GET /posts/search?q=&subject=` |
| Post | Público | `GET /posts/:id` |
| Login | Público | `POST /login` |
| Admin | Professor | `GET /posts`, `DELETE /posts/:id` |
| PostForm | Professor | `POST /posts` ou `GET` + `PUT /posts/:id` |
| Professores | Professor | `GET /teachers?page=&limit=&subject=`, `DELETE /teachers/:id` |
| TeacherForm | Professor | `POST /teachers` ou `GET` + `PUT /teachers/:id` |
| Alunos | Professor | `GET /students?page=&limit=&subject=`, `DELETE /students/:id` |
| StudentForm | Professor | `POST /students` ou `GET` + `PUT /students/:id` |

## Permissões

- **Visitante:** lista, busca, filtro por matéria e leitura. Sem as abas administrativas.
- **Professor:** `POST /login` contra a tabela `teachers`. Cria, edita e exclui posts, professores e alunos. Sem token a API responde **401**.

## Uso

1. A Home lista título, autor, matéria e resumo. Toque na tag para filtrar postagens iguais.
2. Abra um post para o texto completo; a tag também filtra.
3. **Entrar** usa o professor do `.env` (`AUTH_EMAIL` / `AUTH_PASSWORD`, domínio `@educatechfiap.com.br`) ou outro docente cadastrado.
4. Nas abas **Admin**, **Professores** e **Alunos**: incluir com **+**, editar/excluir pelos ícones. Professores filtram pela matéria que lecionam; alunos, pela matéria inscrita.
