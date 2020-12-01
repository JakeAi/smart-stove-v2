import { Controller, Get } from '@nestjs/common';
import { OnOff } from '../../constants';
import { FanService } from './service';

@Controller('fan')
export class FanController {
	private fanState: OnOff = OnOff.Off;

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
