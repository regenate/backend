import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { json, urlencoded } from 'express';
import * as helmet from 'helmet';
import { AllExceptionsFilter } from './all-exception.filter';
import { AppModule } from './app.module';
import { LoggerService } from './logger';
import { Logger } from './logger/interfaces';
import useSwaggerUIAuthStoragePlugin from './swagger_plugin';
import { ValidationException } from './validation.exception';
import { ValidationFilter } from './validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
    bodyParser: false,
  });

  app.useGlobalFilters(new AllExceptionsFilter(), new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.reduce(
          (accumulator: Record<string, unknown>, error: ValidationError) => ({
            ...accumulator,
            [error.property]: Object.values(error.constraints).join(', '),
          }),
          {},
        );

        return new ValidationException(messages);
      },
    }),
  );

  const configService = app.get(ConfigService);
  const loggerService: Logger = app.get(LoggerService);

  const options = new DocumentBuilder()
    .setTitle('Regnate API')
    .setDescription('API endpoints for Regnate App')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });

  app.use(helmet());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  const server = await app.listen(+configService.get<string>('port'));

  server.setTimeout(1200000);

  // eslint-disable-next-line
  loggerService.success(
    `${process.env.MODE} app running on: ${await app.getUrl()}`,
  );
}
bootstrap();
