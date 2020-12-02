import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DamperService } from '../damper.module/service';
import { FanService } from '../fan.module/service';
import { TemperatureService } from '../temperature.module/service';


@Injectable()
export class SafetyService {
  constructor(
    private configService: ConfigService,
    private damperService: DamperService,
    private fanService: FanService,
    private temperatureService: TemperatureService,
  ) {
    this.fanService.state$.subscribe();

    this.temperatureService.temperature$
      .pipe()
      .subscribe(async (temp) => {
        if (temp.temperatureCurrent >= 550) {
          this.fanService.setFanOn();
        }
      });
  }

}
