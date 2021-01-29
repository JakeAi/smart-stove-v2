import { Module } from '@nestjs/common';
import { TemperatureModule } from './modules/temperature.module';
import { ProcessModule } from './modules/process.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { WebThermostatModule } from './modules/web-thermostat.module';
import { FanModule } from './modules/fan.module';
import { DamperModule } from './modules/damper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [resolve(__dirname, '../.env'), resolve(__dirname, './.env')],
      isGlobal: true,
    }),
    DamperModule,
    FanModule,
    ProcessModule,
    TemperatureModule,
    WebThermostatModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {
  constructor(
    private configService: ConfigService,
  ) {
    console.log({
      environment: this.configService.get('environment'),
      development: this.configService.get('development'),
      production: this.configService.get('production'),
      decisionMakerIntervalMinutes: this.configService.get('decisionMakerIntervalMinutes'),
      actuatorTravelTimeSeconds: this.configService.get('actuatorTravelTimeSeconds'),
    });
  }
}
