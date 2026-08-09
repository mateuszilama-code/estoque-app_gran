import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

/**
 * Monta as opções de conexão do Sequelize com o SQLite a partir das variáveis
 * de ambiente (ver `.env.example`).
 *
 * - `synchronize: false` — o schema é versionado por migrations (sequelize-cli),
 *   e não criado automaticamente pelo Sequelize.
 * - `autoLoadModels: true` — os models registrados via `SequelizeModule.forFeature`
 *   nos módulos de domínio serão carregados automaticamente (etapas futuras).
 */
export function buildSequelizeOptions(config: ConfigService): SequelizeModuleOptions {
  return {
    dialect: 'sqlite',
    storage: config.get<string>('DB_STORAGE', './database/estoque.sqlite'),
    autoLoadModels: true,
    synchronize: false,
    logging: false,
  };
}
