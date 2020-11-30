import { Module } from '@nestjs/common';
import { ProcessService } from './service';

@Module({
  imports: [],
  controllers: [],
  providers: [ProcessService],
  exports: [ProcessService],
})
export class ProcessModule {

}
