import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

describe('SchedulerController', () => {
  let controller: SchedulerController;
  const schedulerServiceMock = {
    runManually: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulerController],
      providers: [
        {
          provide: SchedulerService,
          useValue: schedulerServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SchedulerController>(SchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call runManually when POST /run is called', async () => {
    await controller.run();
    expect(schedulerServiceMock.runManually).toHaveBeenCalled();
  });
});
