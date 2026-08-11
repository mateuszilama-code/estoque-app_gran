/**
 * Configuração de conexão usada pelo sequelize-cli (migrations e seeders).
 *
 * Espelha a lógica de `src/config/database.config.ts`, para que CLI e aplicação
 * apontem sempre para o mesmo banco:
 *
 * - `DATABASE_URL` definida  → Postgres (deploy: Neon, Netlify Database...)
 * - caso contrário           → SQLite em arquivo (`DB_STORAGE`, padrão local)
 *
 * A aplicação NestJS não lê este arquivo — ela monta o Sequelize em
 * `src/config/database.config.ts`.
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (_) {
  /* dotenv é opcional para o CLI */
}

/** @type {import('sequelize').Options} */
let base;

if (process.env.DATABASE_URL) {
  base = {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    dialectOptions: {
      // Provedores gerenciados exigem TLS (ver database.config.ts).
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  };
} else {
  base = {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database/estoque.sqlite',
    logging: false,
  };
}

// Registra os seeders executados numa tabela de controle (como já acontece com
// as migrations). Sem isso o padrão do CLI é reexecutá-los a cada chamada, o
// que duplicaria os dados de exemplo a cada deploy.
base.seederStorage = 'sequelize';

module.exports = {
  development: base,
  test: base,
  production: base,
};
