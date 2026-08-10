# estoque-app_gran — Sistema de Controle de Estoque

**Projeto Disciplina Projeto Integrador**

> **Projeto Integrador: Full Stack** · Faculdade Gran
> Aplicação full-stack para cadastro e gestão de **Fornecedores**, **Produtos** e da
> **associação (muitos-para-muitos) entre Produto e Fornecedor**.

![status](https://img.shields.io/badge/status-MVP%20completo-brightgreen)
![stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Next.js%20%7C%20SQLite-blue)

---

## Sobre o Projeto

Este repositório implementa o **sistema de controle de estoque** proposto no material da disciplina.
A partir das histórias de usuário levantadas nas reuniões entre analistas de requisitos e a área de
negócio, o sistema permite que um gerente de compras/estoque possa:

- **Cadastrar e gerenciar fornecedores**, com CNPJ único por fornecedor.
- **Cadastrar e gerenciar produtos**, com código de barras único (quando informado) e categorização.
- **Associar e desassociar fornecedores a produtos**, rastreando de quais fornecedores cada produto
  é adquirido.

Backend e frontend ficam em um **monorepo**. Todas as regras de negócio e mensagens ao usuário
seguem os cenários do enunciado — inclusive o texto exato das mensagens.

### Histórias de usuário e mensagens implementadas

| Feature | Cenário | Mensagem exibida |
| ------- | ------- | ---------------- |
| **Cadastro de Fornecedor** | Sucesso | *Fornecedor cadastrado com sucesso!* |
| | CNPJ já existente | *Fornecedor com esse CNPJ já está cadastrado!* |
| | Dados inválidos | Erros por campo, ao lado de cada entrada inválida |
| **Cadastro de Produto** | Sucesso | *Produto cadastrado com sucesso!* |
| | Código de barras já existente | *Produto com este código de barras já está cadastrado!* |
| | Dados inválidos | Erros por campo, ao lado de cada entrada inválida |
| **Associação Fornecedor ↔ Produto** | Sucesso | *Fornecedor associado com sucesso ao produto!* |
| | Fornecedor já associado | *Fornecedor já está associado a este produto!* |
| | Desassociação | *Fornecedor desassociado com sucesso!* |

---

## O que o enunciado pede × o que foi entregue

| Requisito do material | Entrega |
| --------------------- | ------- |
| **3 controllers no backend** (Produto, Fornecedor, Associação Produto/Fornecedor) | `produtos.controller.ts`, `fornecedores.controller.ts` e `produto-fornecedor.controller.ts`, todos com CRUD e documentados na Swagger |
| **SQLite** como banco inicial | SQLite via Sequelize, com *migrations* e *seeder* versionados (`sequelize-cli`) |
| Testar as rotas com **Insomnia/Postman** | Além disso, a API expõe **Swagger UI** em `/docs` — dá para testar direto no navegador, sem instalar nada |
| **3 páginas no frontend** consumindo o backend | `/produtos`, `/fornecedores` e `/produtos/[id]/fornecedores` (associação) |
| Relação **muitos-para-muitos** entre produto e fornecedor | Tabela de junção `produto_fornecedores` com `belongsToMany`, consulta nos dois sentidos (produtos de um fornecedor e fornecedores de um produto) |
| Repositório **público** para portfólio | Este repositório |

---

## Stack Tecnológica

| Camada | Tecnologia |
| ------ | ---------- |
| **Backend** | Node.js · [NestJS](https://nestjs.com/) · TypeScript |
| **ORM / Banco** | [Sequelize](https://sequelize.org/) + `sequelize-typescript` · `sequelize-cli` (migrations/seeders) · **SQLite** |
| **Docs da API** | [Swagger / OpenAPI](https://swagger.io/) via `@nestjs/swagger` (UI em `/docs`) |
| **Frontend** | [React](https://react.dev/) · [Next.js](https://nextjs.org/) (App Router) · TypeScript |
| **UI / Design System** | [Tailwind CSS](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) (Radix UI) · lucide-react · sonner |
| **Qualidade** | class-validator · class-transformer · ESLint · Prettier · Jest (43 testes) |
| **Versionamento** | Git + Conventional Commits |

> O *porquê* de cada escolha está em [docs/sdd.html — 5. Decisões Técnicas](docs/sdd.html#decisoes).

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 20+ (validado no Node 24), npm e Git.

```bash
git clone https://github.com/mateuszilama-code/estoque-app_gran.git
cd estoque-app_gran
```

### 1. Backend (`apps/api`) — porta 3000

```bash
cd apps/api

npm install                  # instalar dependências
cp .env.example .env         # (opcional) ajustar PORT / DB_STORAGE

npm run db:migrate           # cria as tabelas no SQLite
npm run db:seed:all          # popula 2 fornecedores e 3 produtos de exemplo

npm run start                # sobe a API (ou npm run start:dev, em modo watch)
npm test                     # (opcional) roda os testes unitários
```

Com a API no ar:

- **Swagger UI:** <http://localhost:3000/docs> — testa todos os endpoints pelo navegador
- **OpenAPI JSON:** <http://localhost:3000/docs-json>

### 2. Frontend (`apps/web`) — porta 3001

Rode **com o backend no ar**, em outro terminal:

```bash
cd apps/web

npm install                  # instalar dependências
cp .env.example .env.local   # (opcional) ajustar NEXT_PUBLIC_API_URL

npm run dev                  # http://localhost:3001
```

> **Testar em celular na mesma rede:** coloque o IP da máquina em `NEXT_PUBLIC_API_URL`
> (ex.: `http://192.168.0.10:3000`) e reinicie o `npm run dev` — como a variável é embutida no
> bundle, ela é resolvida no navegador do celular, onde `localhost` seria o próprio aparelho.

---

## Endpoints da API

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| `POST` · `GET` | `/fornecedores` | Cadastra / lista fornecedores |
| `GET` · `PATCH` · `DELETE` | `/fornecedores/:id` | Detalha / atualiza / remove um fornecedor |
| `GET` | `/fornecedores/:id/produtos` | Produtos fornecidos por um fornecedor |
| `POST` · `GET` | `/produtos` | Cadastra / lista produtos |
| `GET` · `PATCH` · `DELETE` | `/produtos/:id` | Detalha / atualiza / remove um produto |
| `POST` · `GET` | `/produtos/:produtoId/fornecedores` | Associa / lista fornecedores de um produto |
| `DELETE` | `/produtos/:produtoId/fornecedores/:fornecedorId` | Desassocia um fornecedor do produto |

Contrato completo e testável na **Swagger UI** (`/docs`), sob as tags `fornecedores`, `produtos` e
`associacao`.

---

## Telas

| Rota | Tela |
| ---- | ---- |
| `/` | Início — atalhos para os módulos |
| `/produtos` | Lista e cadastro de produtos (modal), com busca e paginação |
| `/fornecedores` | Lista e cadastro de fornecedores (modal), com busca e paginação |
| `/produtos/[id]/fornecedores` | Associação: detalhes do produto (somente leitura), seleção de fornecedor, associar/desassociar |
| `/associacao` | Ponto de entrada da associação |
| `/design-system` | Vitrine dos tokens e componentes de interface |

A interface segue um layout de dashboard: barra lateral escura fixa e área de conteúdo clara,
responsiva em três estados — *drawer* no celular, trilho de ícones no tablet e barra expandida no
desktop.

---

## Estrutura de Pastas

```
estoque-app_gran/
├── apps/
│   ├── api/                        # Backend NestJS + Sequelize + SQLite
│   │   └── src/
│   │       ├── fornecedores/       # entity, DTOs, service, controller (CRUD + CNPJ único)
│   │       ├── produtos/           # entity, DTOs, service, controller (CRUD + código de barras único)
│   │       ├── produto-fornecedor/ # associação N:N (associar / desassociar / consultar)
│   │       ├── database/           # migrations, seeders e configuração do Sequelize
│   │       └── main.ts             # bootstrap: CORS, validação global e Swagger
│   └── web/                        # Frontend Next.js (App Router)
│       ├── app/                    # rotas (produtos, fornecedores, associação, design-system)
│       ├── components/
│       │   ├── ui/                 # componentes do shadcn/ui
│       │   ├── layout/             # AppShell, Sidebar, Header, StatCard
│       │   └── legacy/             # componentes da primeira versão, em migração
│       └── lib/                    # client HTTP tipado, tipos do domínio, validadores
├── packages/
│   └── shared-types/               # (futuro) tipos compartilhados entre api e web
├── docs/
│   ├── 00-visao-geral.md           # documento mestre: objetivo, stack e histórico de etapas
│   └── sdd.html                    # Software Design Document
└── README.md
```

---

## Documentação

| Documento | Conteúdo |
| --------- | -------- |
| [docs/00-visao-geral.md](docs/00-visao-geral.md) | Documento mestre de acompanhamento: objetivo, stack e histórico datado de todas as etapas. |
| [docs/sdd.html](docs/sdd.html) | **Software Design Document**: escopo funcional, arquitetura, modelo de domínio, decisões técnicas, design system e histórico de revisões. |
| **Swagger UI** (`/docs`) | Documentação **viva** da API REST, disponível após subir o backend. |

---

## Status

**MVP full-stack completo.** Backend com as 3 features e API documentada; frontend com as 3 telas
integradas, sobre um design system próprio.

| Área | Situação |
| ---- | -------- |
| 📚 Documentação (README, SDD, visão geral) | ✅ |
| 🗂️ Estrutura do monorepo | ✅ |
| ⚙️ Backend — NestJS + Sequelize + Swagger | ✅ |
| 🗃️ Migrations e seeders (SQLite) | ✅ |
| 🏢 Módulo Fornecedor (CRUD + CNPJ único) | ✅ |
| 📦 Módulo Produto (CRUD + código de barras único) | ✅ |
| 🔗 Módulo Associação Produto/Fornecedor (N:N) | ✅ |
| 🖥️ Frontend — Next.js + Tailwind + shadcn/ui | ✅ |
| 🧩 Telas (Fornecedor, Produto, Associação) | ✅ |
| 📱 Layout responsivo (mobile · tablet · desktop) | ✅ |

Histórico datado de cada etapa em [docs/00-visao-geral.md](docs/00-visao-geral.md).

---

<sub>Projeto Integrador · Faculdade Gran — https://faculdade.grancursosonline.com.br/</sub>
