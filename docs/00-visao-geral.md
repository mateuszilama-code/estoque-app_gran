# Visão Geral — Documento Mestre de Acompanhamento

> Documento **vivo** que consolida o objetivo, a stack e o **histórico de todas as etapas** do
> projeto. É atualizado ao final de cada etapa concluída. Para o desenho técnico (arquitetura,
> modelo de dados e decisões), consulte o [Software Design Document (`sdd.html`)](sdd.html).

---

## 1. Objetivo e Contexto do Desafio

O **Projeto Integrador: Full Stack (Fase 2)** propõe o desenvolvimento de um **Sistema de Controle
de Estoque**. A gestão de estoque é apresentada no material do desafio como uma peça central para a
lucratividade e a reputação de qualquer negócio, e o aluno assume o papel de desenvolvedor
contratado para construí-la.

A partir de reuniões entre analistas de requisitos e a área de negócio, foram levantadas **três
histórias de usuário**, que definem o escopo funcional do sistema:

1. **Cadastro de Fornecedor** — *Como gerente de compras, quero cadastrar fornecedores para
   gerenciar e rastrear as informações relevantes sobre os fornecedores com quem faço negócios.*
2. **Cadastro de Produto** — *Como gerente de estoque, quero cadastrar produtos para gerenciar e
   rastrear as informações relevantes sobre os produtos disponíveis no estoque.*
3. **Associação de Fornecedor a Produto** — *Como gerente de estoque, quero associar fornecedores
   aos produtos para rastrear de quais fornecedores adquiro cada produto e gerenciar melhor as
   relações de compra.*

Cada história possui **cenários de sucesso e de erro** com mensagens específicas ao usuário (ex.:
*"Fornecedor com esse CNPJ já está cadastrado!"*), que orientam as regras de negócio implementadas
tanto no backend quanto no frontend. O detalhamento de cada cenário está no
[SDD — 2. Escopo Funcional](sdd.html#escopo).

**Meta desta Fase 2:** entregar um MVP full-stack funcional — backend com API REST documentada
(Swagger) e frontend web integrado — cobrindo as três features acima.

---

## 2. Stack Tecnológica Definida

| Camada | Tecnologia | Papel |
| ------ | ---------- | ----- |
| Backend | **Node.js + NestJS** (TypeScript) | Framework de API REST, modular e testável |
| ORM | **Sequelize** + `sequelize-typescript` | Mapeamento objeto-relacional |
| Migrations/Seeders | **sequelize-cli** | Versionamento de schema e dados de exemplo |
| Banco de dados | **SQLite** | Persistência local, sem servidor, ideal para o MVP |
| Documentação de API | **@nestjs/swagger** (OpenAPI) | Documentação viva da API em `/docs` |
| Validação | **class-validator / class-transformer** | Validação e transformação de DTOs |
| Frontend | **React + Next.js** (App Router, TypeScript) | Interface web e consumo da API |
| Qualidade | **ESLint · Prettier · testes unitários** | Padrão de código e confiabilidade |
| Versionamento | **Git + Conventional Commits** | Controle de versão com histórico granular |

> Justificativas técnicas detalhadas em [SDD — 5. Decisões Técnicas](sdd.html#decisoes).

---

## 3. Histórico de Etapas

Registro cronológico das etapas concluídas. Cada etapa (a partir da 1) possui um `.md` próprio de
detalhamento e um commit no padrão *Conventional Commits*.

> Observação sobre versionamento: por decisão do projeto, os arquivos `docs/NN-*.md` de
> detalhamento de etapa **não são versionados** no Git — apenas a documentação viva
> (`README.md`, `docs/00-visao-geral.md`, `docs/sdd.html`) é commitada. A coluna *".md da etapa"*
> abaixo referencia o arquivo local de cada etapa para consulta.

| Etapa | Data | Resumo | .md da etapa | Commit |
| :---: | :--: | ------ | ------------ | ------ |
| **0** | 2026-08-08 | Estrutura inicial de documentação: `README.md`, `docs/sdd.html`, `docs/00-visao-geral.md` e `.gitignore`; inicialização do Git. | — (base de documentação) | `docs: estrutura inicial de documentacao (readme, sdd, visao geral)` |
| **1** | 2026-08-08 | Estrutura de monorepo criada: `apps/api`, `apps/web` e `packages/shared-types` (vazias, com `.gitkeep`); convenção de commits documentada. | `docs/01-estrutura-monorepo.md` | `chore: estrutura inicial do monorepo (apps/api, apps/web)` |
| 2 | — | Scaffold do backend NestJS + Sequelize + SQLite + Swagger. | `docs/02-scaffold-backend.md` | *pendente* |
| 3 | — | Migrations e seeders com sequelize-cli. | `docs/03-migrations-sequelize.md` | *pendente* |
| 4 | — | Módulo e endpoints de Fornecedor (CRUD + Swagger). | `docs/04-modulo-fornecedor.md` | *pendente* |
| 5 | — | Módulo e endpoints de Produto (CRUD + Swagger). | `docs/05-modulo-produto.md` | *pendente* |
| 6 | — | Módulo de Associação Produto/Fornecedor (N:N). | `docs/06-modulo-associacao.md` | *pendente* |
| 7 | — | Scaffold do frontend Next.js + design system. | `docs/07-scaffold-frontend.md` | *pendente* |
| 8 | — | Telas de Fornecedor, Produto e Associação. | `docs/08-telas-frontend.md` | *pendente* |
| 9 | — | Consolidação final da documentação. | — | *pendente* |

---

## 4. Próximos Passos

- **Etapa 2:** scaffold do backend em `apps/api` — inicializar NestJS, configurar Sequelize + SQLite
  + `@nestjs/swagger` e expor a Swagger UI em `/docs`.

> Este documento deve ser atualizado ao final de cada etapa: nova linha no *Histórico de Etapas*
> (com data, resumo, `.md` e commit) e ajuste dos *Próximos Passos*.
