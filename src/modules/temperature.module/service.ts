import { Injectable } from '@nestjs/common';
import { openSync, SpiDevice, SpiMessage } from 'spi-device';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, mergeMap, share } from 'rxjs/operators';
import { ProcessService } from '../process.module/service';
import { ConfigService } from '@nestjs/config';
import { TemperatureDirection } from '../../constants';


@Injectable()
export class TemperatureService {
  public temperature: Observable<number>;
  public direction: Observable<{ weight: number; direction: TemperatureDirection; }>;
  public averageTemperature: Observable<{ averageTemperature: number; averageTemperaturePrevious: number; previousTemperatures: any[]; }>;

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

    this.temperature = timer(1, 15000)
      .pipe(
        mergeMap(() => this.readTemperature()),
        share(),
      );


    this.averageTemperature = of({ averageTemperature: 0, averageTemperaturePrevious: 0, previousTemperatures: [] })
      .pipe(
        mergeMap((data) => combineLatest([of(data), this.temperature])),
        map(([obj, temperature]) => {
          obj.averageTemperaturePrevious = obj.averageTemperature;
          obj.previousTemperatures.push(temperature);
          if (obj.previousTemperatures.length > 10) {obj.previousTemperatures.shift();}
          obj.averageTemperature = Math.floor(obj.previousTemperatures.reduce((prev, curr) => prev + curr) / obj.previousTemperatures.length);
          return obj;
        }),
        share(),
      );

    this.direction = of({ weight: 0, direction: TemperatureDirection.DOWN }).pipe(
      mergeMap((data) => combineLatest([of(data), this.averageTemperature])),
      map(([weight, averageTemperature]) => {
        if (averageTemperature.averageTemperature - averageTemperature.averageTemperaturePrevious < 0) {
          if (weight.weight > -5) { weight.weight -= 1; }
        } else {
          if (weight.weight < 5) { weight.weight += 1; }
        }
        if (weight.weight < 0) { weight.direction = TemperatureDirection.DOWN; }
        if (weight.weight > 0) { weight.direction = TemperatureDirection.UP; }
        return weight;
      }),
      share(),
    );


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
