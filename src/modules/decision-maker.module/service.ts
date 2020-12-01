import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OFF, ON, OnOff } from '../../constants';
import { TemperatureService } from '../temperature.module/service';
import { combineLatest } from 'rxjs';
import { WebThermostatService } from '../web-thermostat.module/service';


@Injectable()
export class DecisionMakerService {
  public state: OnOff;

  constructor(
    private readonly config: ConfigService,
    private readonly temperatureService: TemperatureService,
    private readonly webThermostatService: WebThermostatService,
  ) {
    this.temperatureService.temperature.subscribe((temp) => console.log(temp));

    combineLatest([
      this.temperatureService.temperature,
      this.temperatureService.averageTemperature,
      this.temperatureService.direction,
    ]).subscribe(([temperature, averageTemperature, direction]) => {

    });
  }

  public setFanState(state: 0 | 1) { this.fan.digitalWrite(state); }

  public setStateOn() { this.setFanState(ON); }

  public setStateOff() { this.setFanState(OFF); }
}
