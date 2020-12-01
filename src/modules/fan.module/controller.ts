import { Controller, Get } from '@nestjs/common';
import { FanService } from './service';

@Controller('fan')
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Get()
  getHello(): void {
    // return this.fanService.getHello();
  }
}
