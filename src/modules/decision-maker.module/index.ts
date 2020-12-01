import { Module }                  from '@nestjs/common';
import { DecisionMakerService }    from './service';
import { DecisionMakerController } from './controller';
import { TemperatureModule }       from '../temperature.module';

@Module({
  imports: [TemperatureModule],
  controllers: [DecisionMakerController],
  providers: [DecisionMakerService],
})
export class DecisionMakerModule {}
