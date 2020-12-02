import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeatingCoolingState, TemperatureDirection } from '../../constants';
import { DamperService } from '../damper.module/service';
import { FanService } from '../fan.module/service';
import { TemperatureService } from '../temperature.module/service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';


@Injectable()
export class WebThermostatService {
  public targetHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public targetTemperature: number = 350;
  public currentHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public currentTemperature: number = 150;

  targetHeatingCoolingState$: BehaviorSubject<HeatingCoolingState> = new BehaviorSubject<HeatingCoolingState>(HeatingCoolingState.Off);


  constructor(
    private configService: ConfigService,
    private damperService: DamperService,
    private fanService: FanService,
    private temperatureService: TemperatureService,
  ) {
    this.fanService.state$.subscribe();

    combineLatest([
      this.targetHeatingCoolingState$,
      this.temperatureService.temperature$,
    ])
      .pipe(
        filter(([state, temp]) => state === HeatingCoolingState.Heat),
      )
      .subscribe(async ([state, temp]) => {

        let { temperatureCurrent, direction } = temp;
        let { actuatorPosition } = this.damperService;

        if (temperatureCurrent < 50) { return await this.damperService.setDamperPosition(0); }

        if (temperatureCurrent < this.targetTemperature) {
          if (direction === TemperatureDirection.DOWN) { await this.damperService.setDamperPosition(actuatorPosition + 10); }
          if (direction === TemperatureDirection.UP) { await this.damperService.setDamperPosition(actuatorPosition + 5); }
        }

        if (temperatureCurrent > this.targetTemperature) {
          if (direction === TemperatureDirection.DOWN) { await this.damperService.setDamperPosition(actuatorPosition + 5); }
          if (direction === TemperatureDirection.UP) { await this.damperService.setDamperPosition(actuatorPosition - 10); }
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

  private isRange(temp, low, high) {
    return temp > low && temp <= high;
  }

}
