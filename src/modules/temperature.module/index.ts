import { Module } from '@nestjs/common';
import { TemperatureService } from './service';
import { TemperatureController } from './controller';
import { ProcessModule } from '../process.module';

@Module({
  imports: [ProcessModule],
  controllers: [TemperatureController],
  providers: [TemperatureService],
  exports: [TemperatureService],
})
export class TemperatureModule {

}
