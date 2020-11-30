import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FanModule } from './modules/fan.module';
import { TemperatureModule } from './modules/temperature.module';
import { ProcessModule } from './modules/process.module';

@Module({
  imports: [
    ProcessModule,
    FanModule,
    TemperatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
