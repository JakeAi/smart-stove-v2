import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DamperService } from './service';

@Controller('damper')
export class DamperController {
  constructor(private readonly damperService: DamperService) {}

  @Get('/position')
  getDamperPosition() {
    return { position: this.damperService.actuatorPosition };
  }

  @Get('/position/:position')
  setDamperPosition(@Param('position', ParseIntPipe) position: number): Promise<void> {
    return this.damperService.setDamperPosition(position);
  }
}
