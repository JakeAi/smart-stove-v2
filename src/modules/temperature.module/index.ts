import { Module } from '@nestjs/common';
import { TemperatureService } from './service';
import { TemperatureController } from './controller';

@Module({
  imports: [],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {

}
