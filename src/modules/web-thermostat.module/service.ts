import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeatingCoolingState, TemperatureDirection } from '../../constants';
import { DamperService } from '../damper.module/service';
import { FanService } from '../fan.module/service';
import { TemperatureService } from '../temperature.module/service';
import { BehaviorSubject, timer } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';


@Injectable()
export class WebThermostatService {
  public targetHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public targetTemperature: number = 350;
  public currentHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public currentTemperature: number = 150;

  targetHeatingCoolingState$: BehaviorSubject<HeatingCoolingState> = new BehaviorSubject<HeatingCoolingState>(HeatingCoolingState.Off);

  private readonly logger = new Logger(WebThermostatService.name);
  private smallJump: number;
  private largeJump: number;
  private overTemperatureDelta: number;
  private decisionMakerIntervalMinutes: number;

  constructor(
    private configService: ConfigService,
    private damperService: DamperService,
    private fanService: FanService,
    private temperatureService: TemperatureService,
  ) {
    this.fanService.state$.subscribe();

    this.smallJump = parseInt(this.configService.get('smallJump', '5'), 10);
    this.largeJump = parseInt(this.configService.get('largeJump', '10'), 10);
    this.overTemperatureDelta = parseInt(this.configService.get('overTemperatureDelta', '50'), 10);
    this.decisionMakerIntervalMinutes = parseInt(this.configService.get('decisionMakerIntervalMinutes', '5'), 10);

    timer(30 * 1000, this.decisionMakerIntervalMinutes * 60 * 1000)
      .pipe(
        withLatestFrom(this.targetHeatingCoolingState$, this.temperatureService.temperature$),
        filter(([iterator, state, temp]) => state === HeatingCoolingState.Heat),
      )
      .subscribe(async ([iterator, state, temp]) => {


        let { temperatureCurrent, direction, directionWeight } = temp;
        let { actuatorPosition } = this.damperService;


        if (temperatureCurrent < 80) { return await this.damperService.setDamperPosition(0); }

        if (temperatureCurrent < this.targetTemperature) {
          if (direction === TemperatureDirection.DOWN) {return  await this.damperService.setDamperPosition(actuatorPosition + this.largeJump); }
        }


        if (
          temperatureCurrent > this.targetTemperature &&
          temperatureCurrent < this.targetTemperature + this.overTemperatureDelta
        ) {
          if (direction === TemperatureDirection.DOWN) { return await this.damperService.setDamperPosition(actuatorPosition + this.smallJump); }
        }


        if (temperatureCurrent > this.targetTemperature + this.overTemperatureDelta) {
          if (direction === TemperatureDirection.UP) { return await this.damperService.setDamperPosition(actuatorPosition - this.smallJump); }
        }


      });
  }

  public setTargetHeatingCoolingState(state: HeatingCoolingState) {
    this.targetHeatingCoolingState = state;
    this.currentHeatingCoolingState = state;
    this.targetHeatingCoolingState$.next(state);
  }

  public setTargetTemperature(temp: number) {
    this.targetTemperature = temp;
  }
}
