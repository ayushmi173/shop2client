import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from 'src/upload';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      dest: '/uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
