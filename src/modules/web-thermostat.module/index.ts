import { Module } from '@nestjs/common';
import { WebThermostatController } from './controller';

@Module({
  imports: [],
  controllers: [WebThermostatController],
  providers: [],
})
export class WebThermostatModule {}
