import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnOff } from '../../constants';
import { TemperatureService } from '../temperature.module/service';
import { combineLatest, Subject } from 'rxjs';
import { WebThermostatService } from '../web-thermostat.module/service';
import { filter, tap } from 'rxjs/operators';


@Injectable()
export class DecisionMakerService {
  public state: OnOff;
  public   state$: Subject<OnOff> = new Subject<OnOff>();

  constructor(
    private readonly config: ConfigService,
    private readonly temperatureService: TemperatureService,
    private readonly webThermostatService: WebThermostatService,
  ) {
    this.temperatureService.temperature.subscribe((temp) => console.log(temp));

    combineLatest([
      this.state$,
      this.temperatureService.temperature,
      this.temperatureService.averageTemperature,
      this.temperatureService.direction,
    ]).pipe(
      filter(([state, temp, avg, dir]) => state === OnOff.On),
      tap(d => console.log(d)),
    ).subscribe(([temperature, averageTemperature, direction]) => {
      console.log('here');
    });
  }

  public setState(state: 0 | 1) {
    this.state = state;
    this.state$.next(this.state);
  }

}
