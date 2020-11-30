import { Injectable } from '@nestjs/common';
import { Gpio } from 'pigpio';
import { GpioPins } from '../../app.service';
import { OFF, ON } from '../../constants';


@Injectable()
export class FanService {
  private fan: Gpio;

  constructor() {
    this.fan = new Gpio(GpioPins.FAN, { mode: Gpio.OUTPUT });
  }

  public setFanState(state: 0 | 1) { this.fan.digitalWrite(state); }

  public setFanOn() { this.setFanState(ON); }

  public setFanOff() { this.setFanState(OFF); }
}
