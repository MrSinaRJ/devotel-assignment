import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly _healthService: HealthService) {}

  /**
   * Health check endpoint
   * @returns {Object} - health check response
   */
  @Get()
  check(): { checked: string } {
    return this._healthService.check();
  }
}
