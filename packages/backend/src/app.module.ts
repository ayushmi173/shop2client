import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseProvider from '../databaseConfig';
import { ProductModule } from './product/product.module';
import { CatagoryModule } from './catagory/catagory.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { backendConfigSchema } from '@package/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: backendConfigSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(DatabaseProvider),
    ProductModule,
    CatagoryModule,
    UploadModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
