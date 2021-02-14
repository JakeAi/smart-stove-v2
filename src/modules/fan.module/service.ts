import { Injectable } from '@nestjs/common';
import { Gpio } from 'pigpio';
import { GpioPins, OFF, ON, OnOff, TemperatureDirection } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { TemperatureService } from '../temperature.module/service';
import { filter } from 'rxjs/operators';


@Injectable()
export class FanService {
  public state: OnOff = OnOff.Off;
  public state$: BehaviorSubject<OnOff> = new BehaviorSubject<OnOff>(OnOff.Off);
  private fan: Gpio;

  constructor(
    private tempService: TemperatureService,
  ) {
    this.fan = new Gpio(GpioPins.FAN, { mode: Gpio.OUTPUT });
    this.next(this.fan.digitalRead());

    this.tempService.temperature$
      .pipe(
        filter(temp => temp.temperatureCurrent < 100),
        filter(temp => temp.direction < TemperatureDirection.DOWN),
      )
      .subscribe(temp => this.setFanOff());

  }

  public setFanState(state: OnOff) {
    if (this.state === state) { return; }
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
