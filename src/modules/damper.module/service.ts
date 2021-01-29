import { Injectable } from '@nestjs/common';
import { Gpio } from 'pigpio';
import { GpioPins, OFF, ON, sleep } from '../../constants';
import { ConfigService } from '@nestjs/config';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DamperService {
  public actuatorPosition: number = 100;
  public actuatorPosition$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private actuatorOpen: Gpio;
  private actuatorClose: Gpio;
  private actuatorTravelTime: number;

  constructor(private readonly config: ConfigService) {
    this.actuatorTravelTime = config.get('actuatorTravelTimeSeconds', 7);
    this.actuatorOpen = new Gpio(GpioPins.ACTUATOR_OPEN, { mode: Gpio.OUTPUT });
    this.actuatorClose = new Gpio(GpioPins.ACTUATOR_CLOSE, { mode: Gpio.OUTPUT });
    this.setDamperPosition(100);
  }

  public async setDamperPosition(position: number) {
    if (position === this.actuatorPosition) { return; }
    if (position < 0) { position = 0; }
    if (position > 100) { position = 100; }

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
    this.next(position);
  }

  public async closeDamper() {
    this.actuatorClose.digitalWrite(ON);
    await sleep(this.actuatorTravelTime * 1000);
    this.actuatorClose.digitalWrite(OFF);
    this.next(0);
  }

  public async openDamper() {
    this.actuatorOpen.digitalWrite(ON);
    await sleep(this.actuatorTravelTime * 1000);
    this.actuatorOpen.digitalWrite(OFF);
    this.next(100);
  }

  private next(position: number) {
    this.actuatorPosition = position;
    this.actuatorPosition$.next(this.actuatorPosition);
  }
}
