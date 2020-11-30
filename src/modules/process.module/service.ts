import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class ProcessService {
  public tearDownCallbacks = [];
  public processEvents: Subject<any> = new Subject<any>();

  constructor() {
    process.on('SIGINT', () => Promise.all(this.tearDownCallbacks).then(() => setTimeout(() => process.exit(), 3000)));
  }
}
