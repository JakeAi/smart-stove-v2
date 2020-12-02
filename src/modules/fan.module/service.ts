import { Injectable } from '@nestjs/common';
import { Gpio } from 'pigpio';
import { GpioPins, OFF, ON, OnOff } from '../../constants';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class FanService {
  public state: OnOff = OnOff.Off;
  public state$: BehaviorSubject<OnOff> = new BehaviorSubject<OnOff>(OnOff.Off);
  private fan: Gpio;

  constructor() {
    this.fan = new Gpio(GpioPins.FAN, { mode: Gpio.OUTPUT });
    this.next(this.fan.digitalRead());
  }

  public setFanState(state: 0 | 1) {
    this.fan.digitalWrite(state);
    this.next(state);
  }

  private next(state: number) {
    this.state = state;
    this.state$.next(this.state);
  }

  public setFanOn() { this.setFanState(ON); }

  public setFanOff() { this.setFanState(OFF); }
}
