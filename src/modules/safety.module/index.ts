import { Module } from '@nestjs/common';
import { SafetyService } from './service';
import { TemperatureModule } from '../temperature.module';
import { DamperModule } from '../damper.module';
import { FanModule } from '../fan.module';

@Module({
  imports: [TemperatureModule, DamperModule, FanModule],
  controllers: [],
  providers: [SafetyService],
  exports: [SafetyService],
})
export class SafetyModule {}
