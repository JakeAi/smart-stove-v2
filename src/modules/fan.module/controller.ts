import { Controller, Get } from '@nestjs/common';
import { FanService } from './service';

@Controller('fan')
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Get()
  getFanStatus(): number {
    return this.fanService.fanState;
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
