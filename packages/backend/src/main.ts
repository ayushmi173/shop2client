import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACKEND_PORT;
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`Application running on Port: ${port}`);
}
bootstrap();
