import { Controller, Get } from '@nestjs/common';
import { DecisionMakerService } from './service';
import { OFF, ON } from '../../constants';

@Controller('decision-maker')
export class DecisionMakerController {
  constructor(private readonly decisionMakerService: DecisionMakerService) {}

  @Get()
  getStateStatus() {
    return this.decisionMakerService.state$.asObservable();
  }

  @Get('/on')
  setStateOn() {
    return this.decisionMakerService.setState(ON);
  }

  @Get('/off')
  setStateOff() {
    return this.decisionMakerService.setState(OFF);
  }
}
