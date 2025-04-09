import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  /**
   * Health check method
   * @returns {Object} - health check response
   */
  check(): { checked: string } {
    return { checked: new Date().toISOString() };
  }
}
