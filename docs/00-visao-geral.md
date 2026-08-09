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
| **2** | 2026-08-08 | Scaffold do backend em `apps/api`: NestJS 11 + Sequelize/SQLite + Swagger (UI em `/docs`, JSON em `/docs-json`); estrutura feature-first (fornecedores, produtos, produto-fornecedor). Servidor sobe e Swagger carrega. | `docs/02-scaffold-backend.md` | `chore(api): scaffold NestJS com Sequelize e Swagger configurados` |
| **3** | 2026-08-09 | Schema versionado com sequelize-cli: migrations de `fornecedores`, `produtos` e `produto_fornecedores` (com UNIQUE de cnpj, codigo_barras e do par produto/fornecedor) + seeder (2 fornecedores, 3 produtos). Migrations e constraint de unicidade validadas no SQLite. | `docs/03-migrations-sequelize.md` | `feat(db): migrations e seeders iniciais de fornecedor, produto e associacao` |
| **4** | 2026-08-09 | Módulo de Fornecedor completo em `apps/api`: entity, DTOs validados (`class-validator` + `@ApiProperty`), service com regra de **CNPJ único** e CRUD REST documentado na Swagger UI (tag `fornecedores`). Toolchain de testes (Jest + @swc/jest): 16 testes verdes. CRUD validado por `curl` (201/409/400/404/204). | `docs/04-modulo-fornecedor.md` | `feat(api): CRUD de fornecedor com validacoes e documentacao swagger` |
| **5** | 2026-08-09 | Módulo de Produto completo em `apps/api`: entity, DTOs validados (`categoria` como enum *Eletrônicos/Alimentos/Vestuário/Outro*), service com regra de **código de barras único** (quando informado) e CRUD REST documentado na Swagger UI (tag `produtos`). Testes: 34 verdes no total. CRUD validado por `curl` (201/409/400/404/204). | `docs/05-modulo-produto.md` | `feat(api): CRUD de produto com validacoes e documentacao swagger` |
| 6 | — | Módulo de Associação Produto/Fornecedor (N:N). | `docs/06-modulo-associacao.md` | *pendente* |
| 7 | — | Scaffold do frontend Next.js + design system. | `docs/07-scaffold-frontend.md` | *pendente* |
| 8 | — | Telas de Fornecedor, Produto e Associação. | `docs/08-telas-frontend.md` | *pendente* |
| 9 | — | Consolidação final da documentação. | — | *pendente* |

---

## 4. Próximos Passos

- **Etapa 6:** módulo de Associação Produto/Fornecedor (N:N) — endpoints para associar/desassociar
  fornecedores a um produto, com a regra de associação única (`uq_produto_fornecedor`) e as mensagens
  do desafio, documentado na Swagger UI (tag `associacao`).

> Este documento deve ser atualizado ao final de cada etapa: nova linha no *Histórico de Etapas*
> (com data, resumo, `.md` e commit) e ajuste dos *Próximos Passos*.
