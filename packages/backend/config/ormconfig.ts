import * as dotenv from 'dotenv';
import { CatagoryEntity, ProductEntity } from 'src/entities';
import { ConnectionOptions } from 'typeorm';
dotenv.config();


console.log(__dirname + '');

// https://medium.com/@jonathan.pretre91/clean-architecture-with-nestjs-e089cef65045

export default {
  type: 'postgres',
  host: process.env[ENVIRONMENT_VARIABLES.POSTGRES_HOST],
  port: Number(process.env[ENVIRONMENT_VARIABLES.POSTGRES_PORT]),
  username: process.env[ENVIRONMENT_VARIABLES.POSTGRES_USER],
  password: process.env[ENVIRONMENT_VARIABLES.POSTGRES_PASSWORD],
  database: process.env[ENVIRONMENT_VARIABLES.POSTGRES_DATABASE],
  synchronize: true,
  migrationsRun: true,
  // entities: ['/../packages/backend/src/**/*.entity.{js,ts}'],
  entities: [CatagoryEntity, ProductEntity],
  autoLoadEntities: true,
  migrations: ['../../packages/backend/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
} as ConnectionOptions;
