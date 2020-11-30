import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FanModule } from './modules/fan.module';
import { TemperatureModule } from './modules/temperature.module';

@Module({
  imports: [
    FanModule,
    TemperatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
