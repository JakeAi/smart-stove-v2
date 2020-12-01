export const ON = 1;
export const OFF = 0;

export enum OnOff {
  Off,
  On
}

export function sleep(milliseconds: number): Promise<any> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

export enum TemperatureDirection {
  DOWN,
  UP
}

export enum HeatingCoolingState {
  Off,
  Heat,
  Cool,
  Auto
}


export enum GpioPins {
  FAN = 23,
  ACTUATOR_OPEN = 16,
  ACTUATOR_CLOSE = 12,
}
