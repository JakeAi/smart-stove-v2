import { Controller, Get } from '@nestjs/common';
import { FanService } from './service';

@Controller('fan')
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Get()
  getFanStatus() {
    return this.fanService.state$.asObservable();
  }

  @Get('/on')
  setFanOn() {
    return this.fanService.setFanOn();
  }

  @Get('/off')
  setFanOff() {
    return this.fanService.setFanOff();
  }
}
