import { Controller, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller({ path: 'scheduler', version: '1' })
export class SchedulerController {
  constructor(private readonly _schedulerService: SchedulerService) {}

  @Post('run')
  async run() {
    return this._schedulerService.runManually();
  }
}
