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
│   ├── api/                # Backend NestJS + Sequelize + SQLite (API REST + Swagger)
│   └── web/                # Frontend Next.js (App Router)
├── packages/
│   └── shared-types/       # (futuro) Tipos/DTOs compartilhados entre api e web
├── docs/
│   ├── 00-visao-geral.md   # Documento mestre de acompanhamento (histórico de etapas)
│   ├── sdd.html            # Software Design Document (arquitetura, modelo, decisões)
│   └── NN-*.md             # Registro detalhado de cada etapa (não versionado por padrão)
├── .gitignore
└── README.md
```

> A árvore acima é o **estado-alvo** do monorepo. As pastas `apps/`, `packages/` e os módulos
> internos serão criados nas próximas etapas — esta seção será atualizada com a árvore real a
> cada avanço.

---

## Como Rodar Localmente

> ⚠️ **Placeholder.** O código-fonte (backend e frontend) ainda não foi criado nesta etapa.
> Esta seção será preenchida com os comandos reais de instalação, migração, seed e execução à
> medida que cada parte do sistema for implementada. Roteiro previsto:

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd estoque-app

# 2. Backend (apps/api)  — a detalhar
#    - instalar dependências
#    - configurar .env a partir de .env.example
#    - rodar migrations e seeders (sequelize-cli)
#    - subir a API (Swagger UI em http://localhost:3000/docs)

# 3. Frontend (apps/web) — a detalhar
#    - instalar dependências
#    - configurar NEXT_PUBLIC_API_URL
#    - subir o servidor de desenvolvimento
```

**Pré-requisitos previstos:** Node.js LTS, npm e Git instalados.

---

## Documentação Adicional

| Documento | Descrição |
| --------- | --------- |
| [docs/00-visao-geral.md](docs/00-visao-geral.md) | Documento mestre de acompanhamento: objetivo, stack e **histórico de todas as etapas**. |
| [docs/sdd.html](docs/sdd.html) | **Software Design Document**: introdução, escopo funcional, arquitetura, modelo de domínio, decisões técnicas e histórico de revisões. |
| **Swagger UI** → `http://localhost:3000/docs` | Documentação **viva** da API REST (OpenAPI), disponível após subir o backend. Ainda não ativa nesta etapa. |

---

## Status do Projeto

**Etapa atual:** `Etapa 0 — Estrutura inicial de documentação` ✅

| Área | Situação |
| ---- | -------- |
| 📚 Documentação base (README, SDD, visão geral) | ✅ Concluída |
| 🗂️ Estrutura do monorepo (`apps/`, `packages/`) | ⏳ Pendente |
| ⚙️ Backend — scaffold NestJS + Sequelize + Swagger | ⏳ Pendente |
| 🗃️ Migrations e seeders (SQLite) | ⏳ Pendente |
| 🏢 Módulo Fornecedor (CRUD + validações) | ⏳ Pendente |
| 📦 Módulo Produto (CRUD + validações) | ⏳ Pendente |
| 🔗 Módulo Associação Produto/Fornecedor (N:N) | ⏳ Pendente |
| 🖥️ Frontend — scaffold Next.js + design system | ⏳ Pendente |
| 🧩 Telas (Fornecedor, Produto, Associação) | ⏳ Pendente |

> O histórico detalhado e datado de cada etapa é mantido em
> [docs/00-visao-geral.md](docs/00-visao-geral.md).

---

<sub>Projeto Integrador · Faculdade Gran — https://faculdade.grancursosonline.com.br/</sub>
