import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeatingCoolingState } from '../../constants';
import { DamperService } from '../damper.module/service';
import { FanService } from '../fan.module/service';
import { TemperatureService } from '../temperature.module/service';
import { BehaviorSubject } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';


@Injectable()
export class WebThermostatService {
  public targetHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public targetTemperature: number = 150;
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
    this.temperatureService.temperature.subscribe();
    this.temperatureService.averageTemperature.subscribe();
    this.temperatureService.direction.subscribe();

    this.targetHeatingCoolingState$.pipe(
      filter(state => state === HeatingCoolingState.Heat),
      mergeMap(() => this.temperatureService.temperature),
    ).subscribe((temp) => {

      console.log('HEAT', temp);
    });
  }

  public setTargetHeatingCoolingState(state: HeatingCoolingState) {
    this.targetHeatingCoolingState$.next(state);
  }

}
