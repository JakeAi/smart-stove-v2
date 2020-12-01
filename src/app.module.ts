import { Module } from '@nestjs/common';
import { TemperatureModule } from './modules/temperature.module';
import { ProcessModule } from './modules/process.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { WebThermostatModule } from './modules/web-thermostat.module';
import { FanModule } from './modules/fan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, './.env'),
      isGlobal: true,
    }),
    WebThermostatModule,
    ProcessModule,
    FanModule,
    TemperatureModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
