import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from '@scraper/scraper.service';
import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let scraperMock: { scrapeAll: jest.Mock };

  beforeEach(async () => {
    scraperMock = {
      scrapeAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('* * * * *'), // valid cron
          },
        },
        {
          provide: ScraperService,
          useValue: scraperMock,
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            addCronJob: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call scraperService.scrapeAll() when runManually is called', async () => {
    await service.runManually();
    expect(scraperMock.scrapeAll).toHaveBeenCalled();
  });
});
