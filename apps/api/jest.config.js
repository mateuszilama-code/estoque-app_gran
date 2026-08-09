/**
 * Configuração do Jest para o backend.
 *
 * A transpilação é feita por @swc/jest (rápida e independente da versão do
 * TypeScript, que está fixada em ^6 — ver memória do projeto). Os decorators
 * (NestJS, Sequelize, class-validator) são habilitados via legacyDecorator +
 * decoratorMetadata, e `reflect-metadata` é carregado antes dos testes.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'],
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: true },
        },
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.module.ts', '!main.ts'],
  coverageDirectory: '../coverage',
};
