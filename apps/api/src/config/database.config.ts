import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

/**
 * Monta as opções de conexão do Sequelize a partir das variáveis de ambiente
 * (ver `.env.example`). O projeto roda em dois cenários:
 *
 * - **Local** — SQLite em arquivo (`DB_STORAGE`). É o padrão: sem nada a
 *   instalar ou configurar, basta rodar as migrations.
 * - **Produção** — Postgres, quando `DATABASE_URL` está definida. Usado no
 *   deploy (Neon, Netlify Database, Render Postgres...), onde o disco é
 *   efêmero e um arquivo SQLite seria apagado a cada restart.
 *
 * A escolha é automática pela presença de `DATABASE_URL`, então o mesmo build
 * serve aos dois ambientes. As migrations são compartilhadas: não usam tipos
 * específicos de um dialeto.
 *
 * - `synchronize: false` — o schema é versionado por migrations (sequelize-cli),
 *   e não criado automaticamente pelo Sequelize.
 * - `autoLoadModels: true` — os models registrados via `SequelizeModule.forFeature`
 *   nos módulos de domínio são carregados automaticamente.
 */
export function buildSequelizeOptions(config: ConfigService): SequelizeModuleOptions {
  const common = {
    autoLoadModels: true,
    synchronize: false,
    logging: false,
  } as const;

  const databaseUrl = config.get<string>('DATABASE_URL');

  if (databaseUrl) {
    return {
      ...common,
      dialect: 'postgres',
      uri: databaseUrl,
      dialectOptions: {
        // Provedores gerenciados (Neon, Netlify Database, Render) exigem TLS.
        // `rejectUnauthorized: false` aceita a cadeia do provedor sem embutir
        // o certificado raiz no projeto — a conexão continua criptografada.
        ssl: { require: true, rejectUnauthorized: false },
      },
    };
  }

  return {
    ...common,
    dialect: 'sqlite',
    storage: config.get<string>('DB_STORAGE', './database/estoque.sqlite'),
  };
}
