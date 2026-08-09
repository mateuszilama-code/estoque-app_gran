import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — permite que o frontend (apps/web, porta 3001 por padrão) consuma a API
  // pelo navegador. Origem configurável por CORS_ORIGIN (lista separada por vírgula);
  // por padrão libera todas as origens, adequado ao contexto local/MVP.
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
  });

  // Validação global dos DTOs (usada pelos módulos de domínio nas próximas etapas).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não declaradas nos DTOs
      forbidNonWhitelisted: true, // rejeita payloads com campos extras
      transform: true, // converte tipos conforme os DTOs
    }),
  );

  // ── Swagger / OpenAPI ─────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API - Sistema de Controle de Estoque')
    .setDescription(
      'API REST para cadastro e gestão de Fornecedores, Produtos e da associação ' +
        '(muitos-para-muitos) entre Produto e Fornecedor. Documentação viva do contrato da API.',
    )
    .setVersion('0.1.0')
    .addTag('fornecedores', 'Cadastro e gestão de fornecedores')
    .addTag('produtos', 'Cadastro e gestão de produtos')
    .addTag('associacao', 'Associação muitos-para-muitos entre produtos e fornecedores')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // UI em /docs e JSON do OpenAPI em /docs-json.
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
    customSiteTitle: 'API - Sistema de Controle de Estoque',
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`API rodando em http://localhost:${port} — Swagger UI em http://localhost:${port}/docs`);
}

bootstrap();
