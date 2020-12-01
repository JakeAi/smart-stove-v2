import { Controller, Get } from '@nestjs/common';
import { TemperatureService } from './service';
import { TemperatureDirection } from '../../constants';

@Controller('temperature')
export class TemperatureController {
  public currentTemperature = 0;
  public averageTemperature = { averageTemperature: 0, averageTemperaturePrevious: 0, previousTemperatures: [] };
  public direction = { weight: 0, direction: TemperatureDirection.DOWN };

  constructor(private readonly temperatureService: TemperatureService) {
    this.temperatureService.temperature.subscribe((temp) => this.currentTemperature = temp);
    this.temperatureService.averageTemperature.subscribe((temp) => this.averageTemperature = temp);
    this.temperatureService.direction.subscribe((temp) => this.direction = temp);
  }

  @Get()
  getTemperature() {
    return { temperature: this.currentTemperature };
  }
}
