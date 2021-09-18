import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import connectionOptions from '../config/ormconfig';
import { ProductModule } from './product/product.module';
import { CatagoryModule } from './catagory/catagory.module';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    ProductModule,
    CatagoryModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
