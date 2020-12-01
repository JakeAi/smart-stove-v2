import { Module }                  from '@nestjs/common';
import { WebThermostatController } from './controller';
import { WebThermostatService }    from './service';
import { TemperatureModule }       from '../temperature.module';

@Module({
  imports: [TemperatureModule],
  controllers: [WebThermostatController],
  providers: [WebThermostatService],
  exports: [WebThermostatService],
})
export class WebThermostatModule {}
