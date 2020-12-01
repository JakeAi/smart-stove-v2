import { Controller, Get }      from '@nestjs/common';
import { DecisionMakerService } from './service';
import { OFF, ON, OnOff }       from '../../constants';

@Controller( 'decision-maker' )
export class DecisionMakerController {
  private decisionMakerState: OnOff = OnOff.Off;

  constructor( private readonly decisionMakerService: DecisionMakerService ) {
    this.decisionMakerService.state$.subscribe( state => this.decisionMakerState = state );
  }

  @Get()
  getStateStatus() {
    return this.decisionMakerService.state$.toPromise();
  }

  @Get( '/on' )
  setStateOn() {
    return this.decisionMakerService.setState( ON );
  }

  @Get( '/off' )
  setStateOff() {
    return this.decisionMakerService.setState( OFF );
  }
}
