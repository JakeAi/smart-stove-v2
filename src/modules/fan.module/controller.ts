import { Controller, Get } from '@nestjs/common';
import { FanService } from './service';

@Controller()
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Get()
  getHello(): string {
    return this.fanService.getHello();
  }
}
