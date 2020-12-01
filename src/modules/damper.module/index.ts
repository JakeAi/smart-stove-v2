import { Module } from '@nestjs/common';
import { DamperService } from './service';
import { DamperController } from './controller';

@Module({
  imports: [],
  controllers: [DamperController],
  providers: [DamperService],
})
export class DamperModule {}
