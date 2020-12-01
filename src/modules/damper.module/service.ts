import { Injectable } from '@nestjs/common';
import { Gpio } from 'pigpio';
import { GpioPins } from '../../app.service';
import { OFF, ON, sleep } from '../../constants';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DamperService {
  private actuatorOpen: Gpio;
  private actuatorClose: Gpio;
  private actuatorTravelTime: number;
  private actuatorPosition: number;

  constructor(private readonly config: ConfigService) {
    this.actuatorTravelTime = config.get('actuatorTravelTime', 7);
    this.actuatorOpen = new Gpio(GpioPins.ACTUATOR_OPEN, { mode: Gpio.OUTPUT });
    this.actuatorClose = new Gpio(GpioPins.ACTUATOR_CLOSE, { mode: Gpio.OUTPUT });
  }

  public async setDamperPosition(position: number) {
    if (position === this.actuatorPosition) { return; }
    if (position < 0 || position > 100) { throw new Error('Invalid position ' + position); }
    const distanceToGo = this.actuatorPosition - position;
    const secondsOfTravel = this.actuatorTravelTime * Math.abs(distanceToGo) / 100 * 1000;

    if (secondsOfTravel > this.actuatorTravelTime * 1000 || secondsOfTravel < 0) { throw new Error('Invalid seconds of travel ' + secondsOfTravel); }

    if (distanceToGo > 0) {
      this.actuatorClose.digitalWrite(ON);
      await sleep(secondsOfTravel);
      this.actuatorClose.digitalWrite(OFF);
    } else if (distanceToGo < 0) {
      this.actuatorOpen.digitalWrite(ON);
      await sleep(secondsOfTravel);
      this.actuatorOpen.digitalWrite(OFF);
    }
    this.actuatorPosition = position;
  }

  public async closeDamper() {
    this.actuatorClose.digitalWrite(ON);
    await sleep(this.actuatorTravelTime * 1000);
    this.actuatorClose.digitalWrite(OFF);
    this.actuatorPosition = 0;
  }

  public async openDamper() {
    this.actuatorOpen.digitalWrite(ON);
    await sleep(this.actuatorTravelTime * 1000);
    this.actuatorOpen.digitalWrite(OFF);
    this.actuatorPosition = 100;
  }

}
