# Node.js Backend — Fundamentos

API REST construída **do zero** com Node.js puro, sem frameworks externos. O projeto explora os fundamentos da plataforma: módulo `http` nativo, streams, roteamento manual via regex, persistência em arquivo JSON e importação de dados via CSV.

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| **Node.js** (ESModules) | Runtime e servidor HTTP nativo |
| **`node:http`** | Criação do servidor |
| **`node:crypto`** | Geração de UUIDs |
| **`node:fs/promises`** | Persistência em `db.json` |
| **`csv-parse`** | Parsing de arquivos CSV via stream |

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── server.js               # Entry point — cria e inicia o servidor HTTP
│   ├── database.js             # Camada de dados (in-memory + persistência JSON)
│   ├── routes.js               # Agregador de rotas
│   ├── middleware/
│   │   └── parseBody.js        # Middleware de parsing do body (JSON e CSV)
│   ├── routes/
│   │   ├── tasks.routes.js     # Rotas de tarefas
│   │   └── users.routes.js     # Rotas de usuários
│   └── utils/
│       └── build-route-path.js # Utilitário que converte path em RegExp
├── db.json                     # Banco de dados local (gerado automaticamente)
├── package.json
└── README.md
```

---

## ⚙️ Como Rodar

### Pré-requisitos

- Node.js **v18+**
- npm

### Instalação

```bash
npm install
```

### Executar em modo desenvolvimento (com watch)

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

---

## 🔗 Rotas — Tasks

Base: `/tasks`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tasks` | Lista todas as tarefas |
| `GET` | `/tasks/:id` | Retorna uma tarefa pelo ID |
| `POST` | `/tasks` | Cria uma nova tarefa |
| `PUT` | `/tasks/:id` | Atualiza título e descrição |
| `PATCH` | `/tasks/:id/complete` | Marca/desmarca tarefa como concluída |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |
| `POST` | `/tasks/import` | Importa tarefas via arquivo CSV (stream) |

### Corpo esperado — `POST /tasks`

```json
{
  "title": "Minha tarefa",
  "description": "Descrição da tarefa"
}
```

### Corpo esperado — `PUT /tasks/:id`

```json
{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

### Importação CSV — `POST /tasks/import`

Envie um arquivo `.csv` com `Content-Type: text/csv`. O arquivo deve conter as colunas `title` e `description`:

```csv
title,description
Estudar Node.js,Fundamentos do Node.js
Ler documentação,Ler a doc do csv-parse
```

---

## 🔗 Rotas — Users

Base: `/users`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/users` | Lista todos os usuários |
| `GET` | `/users/:id` | Retorna um usuário pelo ID |
| `POST` | `/users` | Cria um novo usuário |
| `PUT` | `/users/:id` | Atualiza nome e e-mail |
| `DELETE` | `/users/:id` | Remove um usuário |

### Corpo esperado — `POST /users`

```json
{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

## 🔍 Query Parameters (GET)

Ambas as rotas de listagem (`/tasks` e `/users`) suportam os seguintes parâmetros de query:

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `search` | Busca livre em todos os campos string | `?search=node` |
| `filters` | Filtragem por campo exato | `?filters=title=Node` |
| `orderBy` | Ordenação por campo e direção | `?orderBy=title=asc` |
| `page` | Página atual (base 1, usar junto com `limit`) | `?page=2` |
| `limit` | Quantidade de registros por página | `?limit=10` |

**Exemplo combinado:**

```
GET /tasks?search=node&orderBy=title=asc&page=1&limit=5
```

---

## 🧠 Conceitos Aplicados

- **Servidor HTTP nativo** — sem Express ou Fastify, usando apenas `node:http`
- **Roteamento via RegExp** — `buildRoutePath` converte rotas como `/tasks/:id` em expressões regulares com named groups
- **Route params** — capturados via `url.match(route.path).groups`
- **Query params** — extraídos via `new URL(url, 'http://localhost').searchParams`
- **Streaming de body** — leitura assíncrona com `for await (const chunk of req)`
- **Importação CSV via stream** — `req.pipe(parse(...))` com `csv-parse`
- **Persistência em JSON** — a classe `Database` mantém os dados em memória e os grava no `db.json` a cada mutação

---

## 📄 Licença

ISC
