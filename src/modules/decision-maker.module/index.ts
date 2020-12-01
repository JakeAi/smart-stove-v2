import { Module }                  from '@nestjs/common';
import { DecisionMakerService }    from './service';
import { DecisionMakerController } from './controller';
import { TemperatureModule }       from '../temperature.module';
import { WebThermostatModule }     from '../web-thermostat.module';

@Module({
  imports: [TemperatureModule,WebThermostatModule],
  controllers: [DecisionMakerController],
  providers: [DecisionMakerService],
})
export class DecisionMakerModule {}
