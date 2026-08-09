# Sistema de Controle de Estoque

> **Projeto Integrador — Full Stack (Fase 2)** · Faculdade Gran
> Aplicação full-stack para cadastro e gestão de **Fornecedores**, **Produtos** e da
> **associação (N:N) entre Produto e Fornecedor**.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Next.js%20%7C%20SQLite-blue)

---

## Sobre o Projeto

Este repositório implementa um **sistema de controle de estoque** a partir das histórias de usuário
levantadas no desafio do Projeto Integrador. O objetivo é permitir que um gerente de compras/estoque
possa:

- **Cadastrar e gerenciar fornecedores**, com CNPJ único por fornecedor.
- **Cadastrar e gerenciar produtos**, com código de barras único (quando informado) e categorização.
- **Associar e desassociar fornecedores a produtos** (relação muitos-para-muitos), rastreando de
  quais fornecedores cada produto é adquirido.

O sistema é dividido em **backend** (API REST documentada via Swagger) e **frontend** (interface web),
organizados em um **monorepo**. Todas as regras de negócio e mensagens ao usuário seguem os cenários
descritos no material do desafio (ex.: *"Fornecedor com esse CNPJ já está cadastrado!"*).

---

## Stack Tecnológica

| Camada        | Tecnologia                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| **Backend**   | Node.js · [NestJS](https://nestjs.com/) · TypeScript                        |
| **ORM / DB**  | [Sequelize](https://sequelize.org/) + `sequelize-typescript` · `sequelize-cli` (migrations/seeders) · **SQLite** |
| **Docs API**  | [Swagger / OpenAPI](https://swagger.io/) via `@nestjs/swagger` (UI em `/docs`) |
| **Frontend**  | [React](https://react.dev/) · [Next.js](https://nextjs.org/) (App Router) · TypeScript |
| **Qualidade** | class-validator · class-transformer · ESLint · Prettier · testes unitários  |
| **Versão**    | Git + Conventional Commits                                                  |

> A definição completa e o *porquê* de cada escolha estão em
> [docs/sdd.html — 5. Decisões Técnicas](docs/sdd.html#decisoes).

---

## Estrutura de Pastas

O projeto adota uma organização de **monorepo**, separando backend e frontend em `apps/`.

```
estoque-app/
├── apps/
│   ├── api/                # Backend NestJS + Sequelize + SQLite (API REST + Swagger) — scaffold na Etapa 2
│   │   └── .gitkeep
│   └── web/                # Frontend Next.js (App Router) — scaffold na Etapa 7
│       └── .gitkeep
├── packages/
│   └── shared-types/       # (futuro) Tipos/DTOs compartilhados entre api e web
│       └── .gitkeep
├── docs/
│   ├── 00-visao-geral.md   # Documento mestre de acompanhamento (histórico de etapas)
│   ├── sdd.html            # Software Design Document (arquitetura, modelo, decisões)
│   └── NN-*.md             # Registro detalhado de cada etapa (não versionado por padrão)
├── .gitignore
└── README.md
```

> **Estrutura criada na Etapa 1.** As pastas `apps/api`, `apps/web` e `packages/shared-types` estão
> vazias (com um marcador `.gitkeep` cada, já que o Git não versiona pastas vazias) e serão
> preenchidas pelos scaffolds do backend e do frontend nas próximas etapas.

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 20+ (validado no Node 24), npm e Git instalados.

### Backend (`apps/api`)

```bash
# a partir da raiz do repositório
cd apps/api

# 1. Instalar dependências
npm install

# 2. (opcional) configurar variáveis de ambiente
cp .env.example .env         # ajuste PORT / DB_STORAGE se necessário

# 3. Criar o schema do banco (SQLite) e popular dados de exemplo
npm run db:migrate           # cria as tabelas (fornecedores, produtos, produto_fornecedores)
npm run db:seed:all          # insere 2 fornecedores e 3 produtos de exemplo

# 4. Subir a API
npm run start                # ou: npm run start:dev (modo watch)

# 5. (opcional) rodar os testes unitários
npm test                     # Jest + @swc/jest
```

Com a API no ar:
- **Swagger UI:** <http://localhost:3000/docs> — inclui o CRUD de **Fornecedor** (tag `fornecedores`)
  e de **Produto** (tag `produtos`).
- **OpenAPI JSON:** <http://localhost:3000/docs-json>

> **Rollback do banco:** `npm run db:migrate:undo` (última migration) · `npm run db:migrate:undo:all`
> (todas) · `npm run db:seed:undo:all` (dados do seeder).
>
> **Endpoints já disponíveis:** `POST`/`GET /fornecedores` e `GET`/`PATCH`/`DELETE /fornecedores/:id`
> (Etapa 4); `POST`/`GET /produtos` e `GET`/`PATCH`/`DELETE /produtos/:id` (Etapa 5). A Associação
> Produto/Fornecedor entra na **Etapa 6**.

### Frontend (`apps/web`)

> ⏳ A detalhar — o scaffold do Next.js será feito na **Etapa 7**.

---

## Documentação Adicional

| Documento | Descrição |
| --------- | --------- |
| [docs/00-visao-geral.md](docs/00-visao-geral.md) | Documento mestre de acompanhamento: objetivo, stack e **histórico de todas as etapas**. |
| [docs/sdd.html](docs/sdd.html) | **Software Design Document**: introdução, escopo funcional, arquitetura, modelo de domínio, decisões técnicas e histórico de revisões. |
| **Swagger UI** → `http://localhost:3000/docs` | Documentação **viva** da API REST (OpenAPI), disponível após subir o backend. Já expõe o CRUD de Fornecedor (tag `fornecedores`). |

---

## Status do Projeto

**Etapa atual:** `Etapa 5 — Módulo Produto (CRUD + Swagger)` ✅

| Área | Situação |
| ---- | -------- |
| 📚 Documentação base (README, SDD, visão geral) | ✅ Concluída |
| 🗂️ Estrutura do monorepo (`apps/`, `packages/`) | ✅ Concluída |
| ⚙️ Backend — scaffold NestJS + Sequelize + Swagger | ✅ Concluída |
| 🗃️ Migrations e seeders (SQLite) | ✅ Concluída |
| 🏢 Módulo Fornecedor (CRUD + validações) | ✅ Concluída |
| 📦 Módulo Produto (CRUD + validações) | ✅ Concluída |
| 🔗 Módulo Associação Produto/Fornecedor (N:N) | ⏳ Pendente |
| 🖥️ Frontend — scaffold Next.js + design system | ⏳ Pendente |
| 🧩 Telas (Fornecedor, Produto, Associação) | ⏳ Pendente |

> O histórico detalhado e datado de cada etapa é mantido em
> [docs/00-visao-geral.md](docs/00-visao-geral.md).

---

<sub>Projeto Integrador · Faculdade Gran — https://faculdade.grancursosonline.com.br/</sub>
