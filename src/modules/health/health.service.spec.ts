import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return an object with checked property as ISO date string', () => {
      // Setup mock date
      const mockDate = new Date('2025-04-08T10:00:00.000Z');
      const originalDate = global.Date;
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.UTC = originalDate.UTC;
      global.Date.parse = originalDate.parse;
      global.Date.now = originalDate.now;

      // Execute the check method
      const result = service.check();

      // Assertions
      expect(result).toBeDefined();
      expect(result).toHaveProperty('checked');
      expect(typeof result.checked).toBe('string');
      expect(result.checked).toBe(mockDate.toISOString());

      // Restore original Date
      global.Date = originalDate;
    });
  });
});
