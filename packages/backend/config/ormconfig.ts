import * as dotenv from 'dotenv';
import { CatagoryEntity, ProductEntity } from 'src/entities';
import { ConnectionOptions } from 'typeorm';
dotenv.config();

export const ENVIRONMENT_VARIABLES = {
  POSTGRES_USER: 'POSTGRES_USER',
  POSTGRES_HOST: 'POSTGRES_DATABASE_HOST',
  POSTGRES_PORT: 'POSTGRES_PORT',
  POSTGRES_PASSWORD: 'POSTGRES_PASSWORD',
  POSTGRES_DATABASE: 'POSTGRES_DATABASE_NAME',
};

console.log(__dirname + '');

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
