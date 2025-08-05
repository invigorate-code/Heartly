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
import { middleware } from 'supertokens-node/framework/express';
import { AppModule } from './app.module';
import { type AllConfigType } from './config/config.type';
import setupSwagger from './utils/setup-swagger';
import { RlsContextMiddleware } from './utils/middleware/rls-context.middleware';
import { SessionContextInitMiddleware } from './utils/middleware/session-context-init.middleware';

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

  // Get configuration first
  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);
  const isDevelopment =
    configService.getOrThrow('app.nodeEnv', { infer: true }) === 'development';
  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });

  // CORS must be configured BEFORE SuperTokens middleware
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      const allowedOrigins = Array.isArray(corsOrigin) ? corsOrigin : [corsOrigin];
      if (corsOrigin === true || corsOrigin === '*' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Log the blocked origin for debugging
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma',
      // Add SuperTokens specific headers
      ...supertokens.getAllCORSHeaders()
    ],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
    preflightContinue: false, // Pass control to the next handler
    maxAge: 86400, // Cache preflight requests for 24 hours
  });

  // Offload compression to a reverse proxy in production if possible.
  app.use(compression());

  // SuperTokens middleware - must be AFTER CORS but before any other middleware that might use sessions
  app.use(middleware());

  // Session Context Init middleware - initializes session context service
  const sessionContextInitMiddleware = app.get(SessionContextInitMiddleware);
  app.use(sessionContextInitMiddleware.use.bind(sessionContextInitMiddleware));

  // RLS Context middleware - sets database context for authenticated users
  const rlsMiddleware = app.get(RlsContextMiddleware);
  app.use(rlsMiddleware.use.bind(rlsMiddleware));

  // --- Simple Audit Logging Middleware ---
  app.use((req: Request, _res: Response, next: NextFunction) => {
    // Log important details for auditing
    const now = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.ip;
    console.info(
      `[AUDIT] ${now} - ${req.method} ${req.originalUrl} - IP: ${ip}`,
    );
    next();
  });
  // --- End Audit Logging Middleware ---
  console.info('CORS Origin:', corsOrigin);

  // Global prefix and versioning
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: [
        { method: RequestMethod.GET, path: '/' },
        { method: RequestMethod.GET, path: 'health' },
        // Exclude SuperTokens auth routes from the API prefix
        { method: RequestMethod.ALL, path: 'auth*' },
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
