import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_VARIABLES } from '@package/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const service = app.get(ConfigService);
  const backendPort = service.get(ENVIRONMENT_VARIABLES.BACKEND_PORT) as number;

  await app.listen(backendPort || 5000);
  logger.log(`Application running on Port: ${backendPort || 5000}`);
}
bootstrap();
