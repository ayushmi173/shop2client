import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import {
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ENVIRONMENT_VARIABLES } from '@package/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const error_messages = errors.map((error: ValidationError) =>
          Object.values(error.constraints ?? {}),
        );
        return new UnprocessableEntityException(error_messages.toString());
      },
      forbidUnknownValues: false,
    }),
  );
  const service = app.get(ConfigService);
  const backendPort = service.get(ENVIRONMENT_VARIABLES.BACKEND_PORT) as number;

  await app.listen(backendPort || 5000);
  logger.log(`Application running on Port: ${backendPort || 5000}`);
}
bootstrap();
