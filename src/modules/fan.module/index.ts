import { Module } from '@nestjs/common';
import { FanService } from './service';
import { FanController } from './controller';

@Module({
  imports: [],
  controllers: [FanController],
  providers: [FanService],
})
export class FanModule {

}
