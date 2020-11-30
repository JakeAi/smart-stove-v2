import { Injectable } from '@nestjs/common';

export const ON = 1;
export const OFF = 0;

export enum GpioPins {
  FAN = 23,
  ACTUATOR_OPEN = 16,
  ACTUATOR_CLOSE = 12,
}

@Injectable()
export class AppService {

  // let fan: Gpio = new Gpio(GpioPins.FAN, { mode: Gpio.OUTPUT });
  // this.pins.fan = new Gpio(GpioPins.FAN, { mode: Gpio.OUTPUT });
  // this.pins.actuatorOpen = new Gpio(GpioPins.ACTUATOR_OPEN, { mode: Gpio.OUTPUT });
  // this.pins.actuatorClose = new Gpio(GpioPins.ACTUATOR_CLOSE, { mode: Gpio.OUTPUT });


  getHello(): string {
    return 'Hello World!';
  }
}
