import { Module } from '@nestjs/common';
import { WebThermostatController } from './controller';
import { WebThermostatService } from './service';

@Module({
  imports: [],
  controllers: [WebThermostatController],
  providers: [WebThermostatService],
})
export class WebThermostatModule {}
