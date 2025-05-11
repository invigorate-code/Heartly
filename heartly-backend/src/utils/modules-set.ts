import { ApiModule } from '@/api/api.module';
import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity, UserRole } from '@/api/user/entities/user.entity';
import { BackgroundModule } from '@/background/background.module';
import appConfig from '@/config/app.config';
import { AllConfigType } from '@/config/config.type';
import { Environment } from '@/constants/app.constant';
import databaseConfig from '@/database/config/database.config';
import { AppDataSource } from '@/database/data-source';
import { TypeOrmConfigService } from '@/database/typeorm-config.service';
import mailConfig from '@/mail/config/mail.config';
import { MailModule } from '@/mail/mail.module';
import redisConfig from '@/redis/config/redis.config';
import { UserResponseDto } from '@/shared/shared.models';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import path from 'path';
import { SuperTokensModule } from 'supertokens-nestjs';
import SuperTokens from 'supertokens-node';
import { User } from 'supertokens-node/lib/build/types';
import Dashboard from 'supertokens-node/recipe/dashboard';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import { DataSource, DataSourceOptions } from 'typeorm';
import loggerFactory from './logger-factory';

async function getUserUsingEmail(
  email: string,
): Promise<UserResponseDto | undefined> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const user = await AppDataSource.getRepository(UserEntity).findOne({
    where: { email },
  });

  if (!user) {
    return undefined;
  }

  return user;
}

async function createSubscriberProfileAndTenantRecord(
  formFields: { id: string; value: any }[],
  userId: string,
): Promise<UserResponseDto> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // check if email is already in use
  const userRepository = AppDataSource.getRepository(UserEntity);
  const user = await userRepository.findOne({
    where: { email: formFields[0].value },
  });

  if (user) {
    throw new Error('Email already in use');
  }

  // create user
  const newUser = userRepository.create({
    id: userId,
    email: formFields.find((f) => f.id === 'actualEmail')?.value,
    username: formFields.find((f) => f.id === 'email')?.value,
    firstName: formFields.find((f) => f.id === 'firstName')?.value,
    lastName: formFields.find((f) => f.id === 'lastName')?.value,
    company: formFields.find((f) => f.id === 'company')?.value,
    role: UserRole.OWNER,
  });

  const userResponse = await userRepository.save(newUser);

  // create tenant
  const tenantRepository = AppDataSource.getRepository(TenantEntity);
  const newTenant = tenantRepository.create({
    name: formFields.find((f) => f.id === 'company')?.value,
    ownerId: userId,
  });

  const tenantResponse = await tenantRepository.save(newTenant);

  return userResponse;
}

async function getEmailUsingUserId(
  userId: string,
): Promise<string | undefined> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepository = AppDataSource.getRepository(UserEntity);
  const user = await userRepository.findOne({
    where: { id: userId },
  });

  return user?.email;
}

function isInputEmail(input: string): boolean {
  return (
    input.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ) !== null
  );
}

function generateModulesSet() {
  const imports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, mailConfig],
      envFilePath: ['.env'],
    }),
  ];
  let customModules: ModuleMetadata['imports'] = [];

  const dbModule = TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
    dataSourceFactory: async (options: DataSourceOptions) => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return new DataSource(options).initialize();
    },
  });

  const SuperTokensInitModule = SuperTokensModule.forRoot({
    framework: 'express',
    supertokens: {
      connectionURI: 'http://localhost:3567',
      apiKey: process.env.NEXT_PUBLIC_ST_API_KEY,
    },
    appInfo: {
      appName: 'heartly',
      apiDomain: 'http://localhost:3001',
      websiteDomain: 'http://localhost:3000',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      EmailPassword.init({
        override: {
          functions: (original) => {
            return {
              ...original,
              signIn: async function (input) {
                console.log('signIn', input);
                if (isInputEmail(input.email)) {
                  const userId = (await getUserUsingEmail(input.email))?.id;
                  if (userId !== undefined) {
                    const superTokensUser = await SuperTokens.getUser(userId);
                    if (superTokensUser !== undefined) {
                      // we find the right login method for this user
                      // based on the user ID.
                      const loginMethod = superTokensUser.loginMethods.find(
                        (lM) =>
                          lM.recipeUserId.getAsString() === userId &&
                          lM.recipeId === 'emailpassword',
                      );

                      if (loginMethod !== undefined) {
                        input.email = loginMethod.email!;
                      }
                    }
                  }
                }
                return original.signIn(input);
              },
            };
          },
          apis: (original) => {
            return {
              ...original,
              generatePasswordResetTokenPOST: async function (input) {
                const emailOrUsername = input.formFields.find(
                  (i) => i.id === 'email',
                )!.value as string;
                if (isInputEmail(emailOrUsername)) {
                  const userId = (await getUserUsingEmail(emailOrUsername))?.id;
                  if (userId !== undefined) {
                    const superTokensUser = await SuperTokens.getUser(userId);
                    if (superTokensUser !== undefined) {
                      // we find the right login method for this user
                      // based on the user ID.
                      const loginMethod = superTokensUser.loginMethods.find(
                        (lM) =>
                          lM.recipeUserId.getAsString() === userId &&
                          lM.recipeId === 'emailpassword',
                      );
                      if (loginMethod !== undefined) {
                        // we replace the input form field's array item
                        // to contain the username instead of the email.
                        input.formFields = input.formFields.filter(
                          (i) => i.id !== 'email',
                        );
                        input.formFields = [
                          ...input.formFields,
                          {
                            id: 'email',
                            value: loginMethod.email!,
                          },
                        ];
                      }
                    }
                  }
                }

                const username = input.formFields.find((i) => i.id === 'email')!
                  .value as string;
                const superTokensUsers: User[] =
                  await SuperTokens.listUsersByAccountInfo(input.tenantId, {
                    email: username,
                  });
                // from the list of users that have this email, we now find the one
                // that has this email with the email password login method.
                const targetUser = superTokensUsers.find(
                  (u) =>
                    u.loginMethods.find(
                      (lM) =>
                        lM.hasSameEmailAs(username) &&
                        lM.recipeId === 'emailpassword',
                    ) !== undefined,
                );

                if (targetUser !== undefined) {
                  if (
                    (await getEmailUsingUserId(targetUser.id)) === undefined
                  ) {
                    return {
                      status: 'GENERAL_ERROR',
                      message:
                        'You need to add an email to your account for resetting your password. Please contact support.',
                    };
                  }
                }
                return original.generatePasswordResetTokenPOST!(input);
              },
              signUpPOST: async function (input) {
                const response = await original.signUpPOST!(input);
                if (response.status === 'OK') {
                  // sign up successful
                  await createSubscriberProfileAndTenantRecord(
                    input.formFields,
                    response.user.id,
                  );
                }
                return response;
              },
              signInPOST: async function (input) {
                if (
                  isInputEmail(
                    input.formFields.find((f) => f.id === 'email')!
                      .value as string,
                  )
                ) {
                  const userId = (
                    await getUserUsingEmail(
                      input.formFields.find((f) => f.id === 'email')!
                        .value as string,
                    )
                  )?.id;
                  if (userId !== undefined) {
                    const superTokensUser = await SuperTokens.getUser(userId);
                    if (superTokensUser !== undefined) {
                      // we find the right login method for this user
                      // based on the user ID.
                      const authProfile = superTokensUser.loginMethods.find(
                        (profile) =>
                          profile.recipeUserId.getAsString() === userId &&
                          profile.recipeId === 'emailpassword',
                      );

                      if (authProfile !== undefined) {
                        input.formFields = input.formFields.filter(
                          (i) => i.id !== 'email',
                        );
                        input.formFields = [
                          ...input.formFields,
                          {
                            id: 'email',
                            value: authProfile.email!,
                          },
                        ];
                      }
                    }
                  }
                }
                return original.signInPOST!(input);
              },
            };
          },
        },
        signUpFeature: {
          formFields: [
            {
              id: 'email',
              validate: async (value) => {
                if (typeof value !== 'string') {
                  return 'Please provide a string input.';
                }

                // first we check for if it's an email
                if (
                  value.match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  ) !== null
                ) {
                  return undefined;
                }

                // since it's not an email, we check for if it's a correct username
                if (value.length < 3) {
                  return 'Usernames must be at least 3 characters long.';
                }
                if (!value.match(/^[a-z0-9_-]+$/)) {
                  return 'Username must contain only alphanumeric, underscore or hyphen characters.';
                }
              },
            },
            {
              id: 'actualEmail',
              validate: async (value) => {
                if (value === '') {
                  console.log('value is empty');
                  // this means that the user did not provide an email
                  return undefined;
                }
                if (
                  value.match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  ) === null
                ) {
                  return 'Email is invalid';
                }

                if ((await getUserUsingEmail(value)) !== undefined) {
                  return 'Email already in use. Please sign in, or use another email';
                }
              },
              optional: true,
            },
            {
              id: 'firstName',
              validate: async (value) => {
                if (!value) return 'First name is required';
              },
            },
            {
              id: 'lastName',
              validate: async (value) => {
                if (!value) return 'Last name is required';
              },
            },
            {
              id: 'company',
              validate: async (value) => {
                if (!value) return 'Company is required';
              },
            },
            {
              id: 'password',
              validate: async (value) => {
                if (value.length < 8) {
                  return 'Password must be 8+ characters';
                }
              },
            },
          ],
        },
        emailDelivery: {
          override: (original) => {
            return {
              ...original,
              sendEmail: async function (input) {
                input.user.email = (await getEmailUsingUserId(input.user.id))!;
                return original.sendEmail(input);
              },
            };
          },
        },
      }), // initializes signin / sign up features
      Session.init({ getTokenTransferMethod: () => 'cookie' }), // initializes session features
      EmailVerification.init({
        mode: 'OPTIONAL', // or "OPTIONAL"
        emailDelivery: {
          override: (originalImplementation) => {
            return {
              ...originalImplementation,
              sendEmail: async function (input) {
                // TODO: create and send email verification email
                input.user.email = (await getEmailUsingUserId(input.user.id))!;

                // Or use the original implementation which calls the default service,
                // or a service that you may have specified in the emailDelivery object.
                return originalImplementation.sendEmail(input);
              },
            };
          },
        },
      }),
      UserRoles.init(),
      Dashboard.init(),
    ],
  });

  const bullModule = BullModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService<AllConfigType>) => {
      return {
        connection: {
          host: configService.getOrThrow('redis.host', {
            infer: true,
          }),
          port: configService.getOrThrow('redis.port', {
            infer: true,
          }),
          password: configService.getOrThrow('redis.password', {
            infer: true,
          }),
          tls: configService.get('redis.tlsEnabled', { infer: true }),
        },
      };
    },
    inject: [ConfigService],
  });

  const i18nModule = I18nModule.forRootAsync({
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
      new HeaderResolver(['x-lang']),
    ],
    useFactory: (configService: ConfigService<AllConfigType>) => {
      const env = configService.get('app.nodeEnv', { infer: true });
      const isLocal = env === Environment.LOCAL;
      const isDevelopment = env === Environment.DEVELOPMENT;
      return {
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: {
          path: path.join(__dirname, '/../i18n/'),
          watch: isLocal,
        },
        typesOutputPath: path.join(
          __dirname,
          '../../src/generated/i18n.generated.ts',
        ),
        logging: isLocal || isDevelopment, // log info on missing keys
      };
    },
    inject: [ConfigService],
  });

  const loggerModule = LoggerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: loggerFactory,
  });

  const cacheModule = CacheModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService<AllConfigType>) => {
      return {
        store: await redisStore({
          host: configService.getOrThrow('redis.host', {
            infer: true,
          }),
          port: configService.getOrThrow('redis.port', {
            infer: true,
          }),
          password: configService.getOrThrow('redis.password', {
            infer: true,
          }),
          tls: configService.get('redis.tlsEnabled', { infer: true }),
        }),
      };
    },
    isGlobal: true,
    inject: [ConfigService],
  });

  const modulesSet = process.env.MODULES_SET || 'monolith';

  switch (modulesSet) {
    case 'monolith':
      customModules = [
        SuperTokensInitModule,
        ApiModule,
        bullModule,
        BackgroundModule,
        cacheModule,
        dbModule,
        i18nModule,
        loggerModule,
        MailModule,
      ];
      break;
    case 'api':
      customModules = [
        ApiModule,
        bullModule,
        cacheModule,
        dbModule,
        i18nModule,
        loggerModule,
        MailModule,
      ];
      break;
    case 'background':
      customModules = [
        bullModule,
        BackgroundModule,
        cacheModule,
        dbModule,
        i18nModule,
        loggerModule,
      ];
      break;
    default:
      console.error(`Unsupported modules set: ${modulesSet}`);
      break;
  }

  return imports.concat(customModules);
}

export default generateModulesSet;
