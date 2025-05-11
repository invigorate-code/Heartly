import {
  ClassSerializerInterceptor,
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'nestjs-pino';
import 'reflect-metadata';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { type AllConfigType } from './config/config.type';
import setupSwagger from './utils/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  // Setup security headers
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     useDefaults: true,
  //     directives: {
  //       // Define default sources; usually 'self' is sufficient for most cases
  //       'default-src': ["'self'"],
  //       // Specify allowed sources for scripts
  //       'script-src': ["'self'", "'unsafe-inline'", 'https://google.com'],
  //       // Specify allowed sources for images, now including the new trusted CDN.
  //       'img-src': [
  //         'https://google.com',
  //         'https://cdn.jsdelivr.net/gh/supertokens/',
  //       ],
  //       // You can add or override additional directives as necessary.
  //     },
  //   }),
  // );

  // Offload compression to a reverse proxy in production if possible.
  app.use(compression());

  // --- Simple Audit Logging Middleware ---
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Log important details for auditing
    const now = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.ip;
    console.info(
      `[AUDIT] ${now} - ${req.method} ${req.originalUrl} - IP: ${ip}`,
    );
    next();
  });
  // --- End Audit Logging Middleware ---

  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);
  const isDevelopment =
    configService.getOrThrow('app.nodeEnv', { infer: true }) === 'development';
  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  console.info('CORS Origin:', corsOrigin);

  // Global prefix and versioning
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: [
        { method: RequestMethod.GET, path: '/' },
        { method: RequestMethod.GET, path: 'health' },
      ],
    },
  );
  app.enableVersioning({ type: VersioningType.URI });

  // Global guards, filters, pipes, and interceptors
  // app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalFilters(new SuperTokensExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(errors),
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  if (isDevelopment) {
    setupSwagger(app);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  console.info(`Server running on ${await app.getUrl()}`);

  return app;
}

void bootstrap();
