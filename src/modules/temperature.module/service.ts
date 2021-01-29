import { Injectable } from '@nestjs/common';
import { openSync, SpiDevice, SpiMessage } from 'spi-device';
import { interval, Observable, of, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ProcessService } from '../process.module/service';
import { ConfigService } from '@nestjs/config';
import { TemperatureDirection } from '../../constants';

export interface Temperature {
  temperatureCurrent: number,
  temperaturePrevious: number,
  temperatureAverageCurrent: number,
  temperatureAveragePrevious: number,
  previousTemperatures: number[],
  directionWeight: number,
  direction: TemperatureDirection,
}

@Injectable()
export class TemperatureService {
  public temperature$: Subject<Temperature> = new Subject<Temperature>();

  private _temperature$: Temperature = {
    temperatureCurrent: 0,
    temperaturePrevious: 0,
    temperatureAverageCurrent: 0,
    temperatureAveragePrevious: 0,
    previousTemperatures: [],
    directionWeight: 0,
    direction: TemperatureDirection.DOWN,
  };

  private max6675: SpiDevice;
  private readTemperatureMessage: SpiMessage = [{ sendBuffer: Buffer.from([0x01, 0xd0, 0x00]), receiveBuffer: Buffer.alloc(2), byteLength: 2, speedHz: 20000 }];
  private temperatureReadingIntervalSeconds: number;


  constructor(
    private processService: ProcessService,
    private configService: ConfigService,
  ) {
    this.processService.tearDownCallbacks.push(() => new Promise((resolve, reject) => {
      this.max6675.close((err: Error | null | undefined) => {
        if (err) { return reject(err); }
        return resolve(true);
      });
    }));

    this.max6675 = openSync(0, 0);

    this.temperatureReadingIntervalSeconds = parseInt(this.configService.get('temperatureReadingIntervalSeconds', '15'), 10);

    interval(this.temperatureReadingIntervalSeconds * 1000)
      .pipe(
        mergeMap(() => this.readTemperature()),
        mergeMap((temperature) => of(this._temperature$)
          .pipe(
            map((temperature$) => ({ temperature, temperature$ })),
          )),
      )
      .subscribe(({ temperature, temperature$ }) => {
        temperature$.temperatureAveragePrevious = temperature$.temperatureAverageCurrent;
        temperature$.temperaturePrevious = temperature$.temperatureCurrent;
        temperature$.temperatureCurrent = temperature;

        temperature$.previousTemperatures.push(temperature);
        if (temperature$.previousTemperatures.length > 10) {temperature$.previousTemperatures.shift();}

        temperature$.temperatureAverageCurrent = Math.floor(temperature$.previousTemperatures.reduce((prev, curr) => prev + curr) / temperature$.previousTemperatures.length);

        if (temperature$.temperatureAverageCurrent - temperature$.temperatureAveragePrevious < 0) {
          if (temperature$.directionWeight > -5) { temperature$.directionWeight -= 1; }
        } else {
          if (temperature$.directionWeight < 5) { temperature$.directionWeight += 1; }
        }
        if (temperature$.directionWeight < 0) { temperature$.direction = TemperatureDirection.DOWN; }
        if (temperature$.directionWeight > 0) { temperature$.direction = TemperatureDirection.UP; }

        this.temperature$.next(temperature$);
      });


  }

  private readTemperature(): Observable<number> {
    return new Observable<number>((observer) => {
      try {
        this.max6675.transfer(this.readTemperatureMessage, (err: Error | null | undefined, message) => {
          if (err) { throw err; }
          if (message[0].receiveBuffer.length !== 2) { throw new Error('not enough data'); }

          let word = (message[0].receiveBuffer[0] << 8) | message[0].receiveBuffer[1];
          if ((word & 0x8006) === 0) {
            let t: number = ((word >>> 0) >> 3) / 4.0;
            let f: number = t * (9 / 5) + 32.0;
            observer.next(Math.floor(f));
            observer.complete();
          }
        });
      } catch (e) {
        observer.error(e);
      }
    });
  }
}
