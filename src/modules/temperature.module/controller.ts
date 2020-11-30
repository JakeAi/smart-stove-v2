import { Controller, Get } from '@nestjs/common';
import { TemperatureService } from './service';

@Controller('temperature')
export class TemperatureController {
  public currentTemperature = 0;

  constructor(private readonly temperatureService: TemperatureService) {
    this.temperatureService.temperature.subscribe((temp) => this.currentTemperature = temp);
  }

  @Get()
  getTemperature() {
    return { temperature: this.currentTemperature };
  }
}
