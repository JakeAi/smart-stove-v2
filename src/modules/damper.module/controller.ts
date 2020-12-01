import { Controller, Get } from '@nestjs/common';
import { DamperService } from './service';

@Controller('damper')
export class DamperController {
  constructor(private readonly fanService: DamperService) {}

  @Get()
  getHello(): void {
    // return this.fanService.getHello();
  }
}
