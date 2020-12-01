import { Controller, Get } from '@nestjs/common';
import { FanService } from './service';

@Controller('fan')
export class FanController {
	private fanState;

	constructor(private readonly fanService: FanService) {
		this.fanService.state$.subscribe(state => this.fanState = state);
	}

	@Get()
	getFanStatus() {
		return this.fanState;
	}

	@Get('/on')
	setFanOn() {
		return this.fanService.setFanOn();
	}

	@Get('/off')
	setFanOff() {
		return this.fanService.setFanOff();
	}
}
