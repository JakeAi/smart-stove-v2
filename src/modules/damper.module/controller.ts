import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DamperService } from './service';
import { OFF, ON } from '../../constants';

@Controller('damper')
export class DamperController {
  constructor(private readonly damperService: DamperService) {}

  @Get('/position')
  getDamperPosition(): number {
    return this.damperService.actuatorPosition;
  }

  @Get('/position/status')
  getDamperStatus(): 1 | 0 {
    return this.damperService.actuatorPosition > 0 ? ON : OFF;
  }


  @Get('/state/on')
  setDamperOn(): Promise<void> {
    return this.damperService.openDamper();
  }

  @Get('/state/off')
  setDamperOff(): Promise<void> {
    return this.damperService.closeDamper();
  }

  @Get('/position/:position')
  setDamperPosition(@Param('position', ParseIntPipe) position: number): Promise<void> {
    return this.damperService.setDamperPosition(position);
  }
}
