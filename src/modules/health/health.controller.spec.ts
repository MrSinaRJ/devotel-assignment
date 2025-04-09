import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return the health check response from service', () => {
      // Arrange
      const mockDate = new Date('2025-04-08T10:00:00.000Z');
      const expectedResult = { checked: mockDate.toISOString() };
      jest.spyOn(healthService, 'check').mockReturnValue(expectedResult);

      // Act
      const result = controller.check();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.checked).toBeDefined();
      expect(typeof result.checked).toBe('string');
      expect(healthService.check).toHaveBeenCalled();
    });
  });
});
