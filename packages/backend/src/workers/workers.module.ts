import { Module } from '@nestjs/common';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';

@Module({
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
