// import * as dotenv from 'dotenv';
import { CatagoryEntity, ProductEntity } from '../src/entities';
// import { ConnectionOptions } from 'typeorm';
// // import { ENVIRONMENT_VARIABLES } from '@package/config';
// dotenv.config();

// console.log(__dirname + '');

// // https://medium.com/@jonathan.pretre91/clean-architecture-with-nestjs-e089cef65045

// export default {
//   type: 'postgres',
//   host: process.env.POSTGRES_DATABASE_HOST,
//   port: Number(process.env.POSTGRES_PORT),
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DATABASE_NAME,
//   synchronize: true,
//   migrationsRun: true,
//   // entities: ['/../packages/backend/src/**/*.entity.{js,ts}'],
//   entities: [CatagoryEntity, ProductEntity],
//   autoLoadEntities: true,
//   migrations: ['../../packages/backend/src/migrations/*{.ts,.js}'],
//   cli: {
//     migrationsDir: 'src/migrations',
//   },
// } as ConnectionOptions;

import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT_VARIABLES } from '@package/config';

import * as path from 'path';

export const DatabaseProvider: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    // todo check if there are any issues with hostname on mac
    const host: string | undefined = configService.get(
      ENVIRONMENT_VARIABLES.POSTGRES_DATABASE_HOST,
    );
    const port: number | undefined = configService.get(
      ENVIRONMENT_VARIABLES.POSTGRES_PORT,
    );
    const username: string | undefined = configService.get(
      ENVIRONMENT_VARIABLES.POSTGRES_USER,
    );
    const password: string | undefined = configService.get(
      ENVIRONMENT_VARIABLES.POSTGRES_PASSWORD,
    );
    const database: string | undefined = configService.get(
      ENVIRONMENT_VARIABLES.POSTGRES_DATABASE_NAME,
    );
    console.log('credentials', host, port, password, database);

    if (
      host === undefined ||
      port === undefined ||
      password === undefined ||
      database === undefined
    ) {
      throw new Error('Incorrect database config');
    }
    // todo get all entities here without needing to explicitly importing
    return {
      type: 'postgres',
      entities: [CatagoryEntity, ProductEntity],
      host,
      port,
      username,
      password,
      database,
      synchronize: false,
      migrationsTableName: 'typeorm_migrations',
      migrations: [
        path.resolve('../../packages/backend/src/migrations/*{.ts,.js}'),
      ],
      cli: {
        migrationsDir: 'migrations',
      },
    };
  },
};

export default DatabaseProvider;
