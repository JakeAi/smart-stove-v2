import { Controller, Get, Query } from '@nestjs/common';
import { HeatingCoolingState } from '../../constants';
import { WebThermostatService } from './service';
import { Temperature, TemperatureService } from '../temperature.module/service';


@Controller('web-thermostat')
export class WebThermostatController {
  public temperature: Temperature;
  public currentTemperature = 0;

  constructor(
    private service: WebThermostatService,
    private temperatureService: TemperatureService,
  ) {
    this.temperatureService.temperature$.subscribe(temp => this.temperature = temp);
  }

  @Get('status')
  status() {
    return {
      targetHeatingCoolingState: this.service.targetHeatingCoolingState,
      currentHeatingCoolingState: this.service.currentHeatingCoolingState,
      targetTemperature: this.service.targetTemperature,
      currentTemperature: (this.temperature.temperatureCurrent - 32) * 5 / 9,
    };
  }

  @Get('/targetHeatingCoolingState')
  targetHeatingCoolingState(@Query('value') targetHeatingCoolingState: string) {
    let targetState: HeatingCoolingState = parseInt(targetHeatingCoolingState);
    this.service.setTargetHeatingCoolingState(targetState);
    console.log({ targetState });
  }

  @Get('/targetTemperature')
  targetTemperature(@Query('value') targetTemperature: string) {
    let temp = Math.floor(parseFloat(targetTemperature));
    let temperatureF = temp * (9 / 5) + 32.0;
    this.service.targetHeatingCoolingState = temperatureF;
    console.log({ temperatureF });
  }

}
