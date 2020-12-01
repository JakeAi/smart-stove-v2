import { Injectable } from '@nestjs/common';
// import { openSync, SpiDevice, SpiMessage } from 'spi-device';
import { ConfigService } from '@nestjs/config';
import { HeatingCoolingState } from '../../constants';


@Injectable()
export class WebThermostatService {
  public targetHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public targetTemperature: number = 0;
  public currentHeatingCoolingState: HeatingCoolingState = HeatingCoolingState.Off;
  public currentTemperature: number = 0;

  constructor(
    private configService: ConfigService,
  ) {

  }
}
