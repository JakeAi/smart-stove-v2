import { Module } from '@nestjs/common';
import { FanService } from './service';
import { FanController } from './controller';
import { TemperatureModule } from '../temperature.module';

@Module({
  imports: [TemperatureModule],
  controllers: [FanController],
  providers: [FanService],
  exports: [FanService],
})
export class FanModule {

}
