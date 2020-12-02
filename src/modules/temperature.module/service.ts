import { Injectable } from '@nestjs/common';
import { openSync, SpiDevice, SpiMessage } from 'spi-device';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
  public temperature$: BehaviorSubject<Temperature> = new BehaviorSubject<Temperature>({
    temperatureCurrent: 0,
    temperaturePrevious: 0,
    temperatureAverageCurrent: 0,
    temperatureAveragePrevious: 0,
    previousTemperatures: [],
    directionWeight: 0,
    direction: TemperatureDirection.DOWN,
  });

  private max6675: SpiDevice;
  private readTemperatureMessage: SpiMessage = [{ sendBuffer: Buffer.from([0x01, 0xd0, 0x00]), receiveBuffer: Buffer.alloc(2), byteLength: 2, speedHz: 20000 }];


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

    timer(1, 15000)
      .pipe(
        mergeMap(() => combineLatest([this.readTemperature(), this.temperature$])),
      )
      .subscribe(([temp, obj]) => {
        obj.temperatureAveragePrevious = obj.temperatureAverageCurrent;
        obj.temperaturePrevious = obj.temperatureCurrent;
        obj.temperatureCurrent = temp;

        obj.previousTemperatures.push(temp);
        if (obj.previousTemperatures.length > 10) {obj.previousTemperatures.shift();}

        obj.temperatureAverageCurrent = Math.floor(obj.previousTemperatures.reduce((prev, curr) => prev + curr) / obj.previousTemperatures.length);

        if (obj.temperatureAverageCurrent - obj.temperatureAveragePrevious < 0) {
          if (obj.directionWeight > -5) { obj.directionWeight -= 1; }
        } else {
          if (obj.directionWeight < 5) { obj.directionWeight += 1; }
        }
        if (obj.directionWeight < 0) { obj.direction = TemperatureDirection.DOWN; }
        if (obj.directionWeight > 0) { obj.direction = TemperatureDirection.UP; }

        this.temperature$.next(obj);
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
