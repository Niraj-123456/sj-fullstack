import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { urlencoded, json } from 'express';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'common/filter/exception.filter';
import { SlackService } from './modules/slack/slack.service';
import { dataSource } from 'data-source';
import { runSeeder, runSeeders } from 'typeorm-extension';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'debug', 'verbose', 'warn'],
  });
  app.use(json({ limit: '50mb' }));

  await dataSource.initialize();
  await runSeeders(dataSource);
  // app.use(body({ extended: true, limit: "50mb" }));

  // app.use(urlencoded({ type: 'multipart/form-data', extended: true }));
  // app.use(
  //   urlencoded({ type: 'multipart/form-data', extended: true, limit: '50mb' }),
  // );
  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, new SlackService()),
  );
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors();
  const basePath = `api/v${process.env.NODE_API_VERSION}`;
  app.setGlobalPrefix(basePath, {
    exclude: [{ path: '/api/core/health-check', method: RequestMethod.GET }],
  });
  if (!configService.isProduction()) {
    let document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Sahaj API')
        .setDescription('Swagger Documentation')
        .setVersion(`${process.env.NODE_API_SUB_VERSION}`)
        // .setBasePath(basePath)
        // .addServer(basePath)
        .addBearerAuth()
        .addApiKey(
          { type: 'apiKey', name: 'sahaj-client-api-key', in: 'header' },
          'sahaj-client-api-key',
        )
        // .addBearerAuth(
        //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        //   'access-token',
        // )
        .build(),
      // { ignoreGlobalPrefix: true },
    );
    // Creating all the swagger schemas based on the class-validator decorators
    const metadata = (getFromContainer(MetadataStorage) as any)
      .validationMetadatas;
    document.components.schemas = Object.assign(
      {},
      document.components.schemas || {},
      validationMetadatasToSchemas(metadata),
    );
    SwaggerModule.setup(`docs`, app, document);
  }

  await app.listen(process.env.NODE_API_PORT);
}

bootstrap();
