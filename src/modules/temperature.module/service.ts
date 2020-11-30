import { Injectable } from '@nestjs/common';
import { openSync, SpiDevice, SpiMessage } from 'spi-device';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, mergeMap, retry, share, switchMap } from 'rxjs/operators';
import { ProcessService } from '../process.module/service';

enum TemperatureDirection {
  DOWN,
  UP
}

@Injectable()
export class TemperatureService {
  private max6675: SpiDevice;
  public temperature: Observable<number>;

  private _previousTemperatures: number[];
  public previousTemperatures: Observable<number[]>;

  public directionWeight: Observable<number>;
  public direction: Observable<{ weight: number; direction: TemperatureDirection; }>;
  private temperatureObservable;
  private readTemperatureMessage: SpiMessage = [{ sendBuffer: Buffer.from([0x01, 0xd0, 0x00]), receiveBuffer: Buffer.alloc(2), byteLength: 2, speedHz: 20000 }];


  private _averageTemperature: number;
  public averageTemperature: Observable<{ averageTemperature: number; averageTemperaturePrevious: number; previousTemperatures: any[]; }>;

  private _averageTemperaturePrevious: number;
  public averageTemperaturePrevious: Observable<number>;

  constructor(
    private processService: ProcessService,
  ) {
    this.processService.tearDownCallbacks.push(() => new Promise((resolve, reject) => {
      this.max6675.close((err: Error | null | undefined) => {
        console.log('here');
        if (err) { return reject(err); }
        return resolve(true);
      });
    }));

    this.max6675 = openSync(0, 0);
    this.temperature = timer(1, 15000)
      .pipe(
        switchMap(() => this.readTemperature()),
        retry(),
      );


    this.averageTemperature = of({ averageTemperature: 0, averageTemperaturePrevious: 0, previousTemperatures: [] })
      .pipe(
        mergeMap((data) => this.temperature.pipe(map((temperature) => {
          data.previousTemperatures.push(temperature);
          // if (data.previousTemperatures.length > 10) { data.previousTemperatures.shift(); }
          return data;
        }))),
        map((data) => {
          data.averageTemperaturePrevious = data.averageTemperature;
          data.averageTemperature = Math.floor(data.previousTemperatures.reduce((prev, curr) => prev + curr) / data.previousTemperatures.length);
          return data;
        }),
      );

    this.direction = of({ weight: 0, direction: TemperatureDirection.DOWN }).pipe(
      mergeMap((weight) => this.averageTemperature.pipe(map((tempData) => {
        if (tempData.averageTemperature - tempData.averageTemperaturePrevious < 0) {
          if (weight.weight > -5) { weight.weight -= 1; }
        } else {
          if (weight.weight < 5) { weight.weight += 1; }
        }
        if (weight.weight < 0) { weight.direction = TemperatureDirection.DOWN; }
        if (weight.weight > 0) { weight.direction = TemperatureDirection.UP; }
        return weight;
      }))),
    );
    // @ts-ignore


    // this.temperature.subscribe((temperature) => {
    //   this._previousTemperatures.push(temperature);
    //   if (this._previousTemperatures.length > 10) { this._previousTemperatures.shift(); }
    //   this.previousTemperatures.next(this._previousTemperatures);
    // });
    combineLatest([this.temperature, this.averageTemperature, this.direction])
      .subscribe(([temperature, averageTemperature, direction]) => console.log(temperature, averageTemperature, direction, '\n\n'));
    // this.previousTemperatures.subscribe((previousTemperatures) => {
    //   console.log({ previousTemperatures });
    //   return;
    //   const averageTemperatureF: number = Math.floor(previousTemperatures.reduce((prev, curr) => prev + curr) / previousTemperatures.length);
    //
    //   if (this._averageTemperature - this._averageTemperaturePrevious < 0) {
    //     if (this.directionWeight > -5) { this.directionWeight -= 1; }
    //   } else {
    //     if (this.directionWeight < 5) { this.directionWeight += 1; }
    //   }
    //
    // });

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
          },
        );
      } catch (e) {
        observer.error(e);
      }
    });
  }
}
