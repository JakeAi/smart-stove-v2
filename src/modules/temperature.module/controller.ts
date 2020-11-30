import { Controller, Get } from '@nestjs/common';
import { TemperatureService } from './service';
import { Observable } from 'rxjs';

@Controller('temperature')
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}

  @Get()
  getTemperature(): Observable<number> {
    return this.temperatureService.temperature;
  }
}
