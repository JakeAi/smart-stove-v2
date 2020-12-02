import { Module } from '@nestjs/common';
import { WebThermostatController } from './controller';
import { WebThermostatService } from './service';
import { TemperatureModule } from '../temperature.module';
import { DamperModule } from '../damper.module';
import { FanModule } from '../fan.module';

@Module({
  imports: [TemperatureModule, DamperModule, FanModule],
  controllers: [WebThermostatController],
  providers: [WebThermostatService],
  exports: [WebThermostatService],
})
export class WebThermostatModule {}
