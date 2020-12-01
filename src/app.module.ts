import { Module }              from '@nestjs/common';
import { TemperatureModule }   from './modules/temperature.module';
import { ProcessModule }       from './modules/process.module';
import { ConfigModule }        from '@nestjs/config';
import { resolve }             from 'path';
import { WebThermostatModule } from './modules/web-thermostat.module';
import { FanModule }           from './modules/fan.module';
import { DamperModule }        from './modules/damper.module';
import { DecisionMakerModule } from './modules/decision-maker.module';

@Module( {
  imports    : [
    ConfigModule.forRoot( {
      envFilePath: resolve( __dirname, './.env' ),
      isGlobal   : true,
    } ),
    DamperModule,
    DecisionMakerModule,
    FanModule,
    ProcessModule,
    TemperatureModule,
    WebThermostatModule,
  ],
  controllers: [],
  providers  : [],
  exports    : [],
} )
export class AppModule {
  constructor() {}
}
