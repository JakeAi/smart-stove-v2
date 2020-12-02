import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeatingCoolingState } from '../../constants';
import { DamperService } from '../damper.module/service';
import { FanService } from '../fan.module/service';
import { TemperatureService } from '../temperature.module/service';
import { BehaviorSubject, combineLatest, zip } from 'rxjs';
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
      mergeMap(() => zip([
        this.fanService.state$,
        this.temperatureService.temperature,
        this.temperatureService.averageTemperature,
        this.temperatureService.direction,
      ])),
    ).subscribe(([fan, temp, avg, dir]) => console.log('HEAT', fan, temp, avg, dir));
  }

  public setTargetHeatingCoolingState(state: HeatingCoolingState) {
    this.targetHeatingCoolingState$.next(state);
  }

}
