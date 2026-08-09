/**
 * Configuração de conexão usada pelo sequelize-cli (migrations e seeders).
 * Lê o mesmo DB_STORAGE do `.env` que a aplicação usa; se o `.env` não existir,
 * cai no padrão `./database/estoque.sqlite` (relativo à raiz de apps/api).
 *
 * A aplicação NestJS não usa este arquivo — ela configura o Sequelize em
 * `src/config/database.config.ts`. Ambos apontam para o mesmo arquivo SQLite.
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (_) {
  /* dotenv é opcional para o CLI */
}

const storage = process.env.DB_STORAGE || './database/estoque.sqlite';

/** @type {import('sequelize').Options} */
const base = {
  dialect: 'sqlite',
  storage,
  logging: false,
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
