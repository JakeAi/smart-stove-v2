import { Injectable } from '@nestjs/common';
import { Gpio } from 'pigpio';
import { GpioPins, OFF, ON, OnOff } from '../../constants';
import { Subject } from 'rxjs';


@Injectable()
export class FanService {
  public state$: Subject<OnOff> = new Subject<OnOff>();
  private fan: Gpio;

  constructor() {
    this.fan = new Gpio(GpioPins.FAN, { mode: Gpio.OUTPUT });
    this.state$.next(this.fan.digitalRead());
  }

  public setFanState(state: 0 | 1) {
    this.fan.digitalWrite(state);
    this.state$.next(state);
  }

  public setFanOn() { this.setFanState(ON); }

  public setFanOff() { this.setFanState(OFF); }
}
