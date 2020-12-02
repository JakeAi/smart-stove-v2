import { Controller, Get } from '@nestjs/common';
import { Temperature, TemperatureService } from './service';

@Controller('temperature')
export class TemperatureController {
  public temperature: Temperature;

  constructor(private readonly temperatureService: TemperatureService) {
    this.temperatureService.temperature$.subscribe((temp) => this.temperature = temp);
  }

  @Get()
  getTemperature() {
    return { temperature: this.temperature.temperatureCurrent };
  }
}
