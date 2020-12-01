import { Controller, Get, Query } from '@nestjs/common';

enum HeatingCoolingState {
  Off,
  Heat,
  Cool,
  Auto
}

@Controller('web-thermostat')
export class WebThermostatController {
  constructor() { }

  @Get('status')
  status() {
    return {
      'targetHeatingCoolingState': 1,
      'currentHeatingCoolingState': 1,
      'targetTemperature': 84,
      'currentTemperature': 80,
    };
  }

  @Get('/targetHeatingCoolingState')
  targetHeatingCoolingState(@Query('value') targetHeatingCoolingState: string) {
    let targetState = parseInt(targetHeatingCoolingState);
    console.log({ targetState });
  }

  @Get('/targetTemperature')
  targetTemperature(@Query('value') targetTemperature: string) {
    let temp = Math.floor(parseFloat(targetTemperature));
    let temperatureF = temp * (9 / 5) + 32.0;
    console.log({ temperatureF });
  }

}
