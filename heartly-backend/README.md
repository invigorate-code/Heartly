<h1 align="center">
  Heartly App
</h1>

## Description

The Heartly app is an advanced, HIPAA-compliant management system designed for Adult Residential Facilities (ARFs) and Adult Residential Treatment Facilities (ARTFs). Its primary objectives are to streamline operations, enhance resident care quality, ensure strict regulatory compliance, improve overall facility management, and provide a seamless experience for all users including owners, administrators, and direct support staff.

## Getting started

```bash
# Clone the repository
git clone git@github.com:invigorate-code/Heartly.git

# Create environment variables file.
cp .env.example .env

# Create environment variables file.
cp .env.docker.example .env.docker

# Install dependences.
pnpm install

# ========================================================
## Make sure to set supertokens api key in both .env & .env.docker files
# ========================================================

# Start up app resources
docker compose up -d

# Sync the DB with backend entities
pnpm db:sync
```

## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Features

- [x] Fastify support. (Checkout the [`feature.fastify`](https://github.com/vndevteam/nestjs-boilerplate/tree/feature.fastify) branch)
- [x] Database. Support [TypeORM](https://www.npmjs.com/package/typeorm)
- [x] Seeding ([Typeorm Extension](https://www.npmjs.com/package/typeorm-extension)).
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Mailing ([@nestjs-modules/mailer](https://www.npmjs.com/package/@nestjs-modules/mailer) & [nodemailer](https://www.npmjs.com/package/nodemailer)).
- [x] Sign in and sign up via email.
- [x] Pagination: Offset and Cursor (Clone from [typeorm-cursor-pagination](https://github.com/benjamin658/typeorm-cursor-pagination) and add more features).
- [x] Internationalization/Translations (I18N) ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [x] Swagger.
- [x] E2E and units tests.
- [x] Docker.
- [x] CI (Github Actions).

## More documentations

Please read the [docs](docs/README.md). It contains the details about the project structure, conventions, and more.

## Resources
- [NestJs Supertokens Setup](https://supertokens.com/docs/quickstart/integrations/nestjs)