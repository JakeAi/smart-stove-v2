import { Module } from '@nestjs/common';
import { DecisionMakerService } from './service';
import { DecisionMakerController } from './controller';

@Module({
  imports: [],
  controllers: [DecisionMakerController],
  providers: [DecisionMakerService],
})
export class DecisionMakerModule {}
