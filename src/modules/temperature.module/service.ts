import { Injectable } from '@nestjs/common';
import { openSync, SpiDevice, SpiMessage } from 'spi-device';
import { Observable, timer } from 'rxjs';
import { retry, share, switchMap } from 'rxjs/operators';

enum TemperatureDirection {
  DOWN,
  UP
}

@Injectable()
export class TemperatureService {
  private max6675: SpiDevice;
  public temperature: Observable<number>;

  public previousTemperaturesF: number[];
  public directionWeight: number;
  public direction: number;

  private temperatureObservable;
  private readTemperatureMessage: SpiMessage = [{ sendBuffer: Buffer.from([0x01, 0xd0, 0x00]), receiveBuffer: Buffer.alloc(2), byteLength: 2, speedHz: 20000 }];

  constructor() {
    this.max6675 = openSync(0, 0);
    this.temperature = timer(1, 3000)
      .pipe(
        switchMap(() => this.readTemperature()),
        retry(),
        share(),
      )
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
