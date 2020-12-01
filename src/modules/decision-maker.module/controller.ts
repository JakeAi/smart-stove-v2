import { Controller, Get } from '@nestjs/common';
import { DecisionMakerService } from './service';

@Controller('decision-maker')
export class DecisionMakerController {
  constructor(private readonly decisionMakerService: DecisionMakerService) {}

  @Get()
  getFanStatus(): number {
    return this.decisionMakerService.state;
  }

  @Get('/on')
  setFanOn() {
    return this.decisionMakerService.setFanOn();
  }

  @Get('/off')
  setFanOff() {
    return this.decisionMakerService.setFanOff();
  }
}
