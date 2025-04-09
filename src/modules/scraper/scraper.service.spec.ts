import { JobOfferDto } from '@job-offers/dto/job-offer.dto';
import { JobOffersService } from '@job-offers/job-offers.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Provider1Response } from './dto/provider1-job.dto';
import { Provider2Response } from './dto/provider2-job.dto';
import { Provider1ProcessorService } from './processors/provider1-processor.service';
import { Provider2ProcessorService } from './processors/provider2-processor.service';
import { ScraperService } from './scraper.service';

describe('ScraperService', () => {
  let service: ScraperService;

  const jobDtoMock: JobOfferDto[] = [
    {
      provider: 1,
      providerId: 'P1-1',
      position: 'Developer',
      company: { name: 'X', website: null, industry: null },
      compensation: { min: 1000, max: 2000, currency: 'USD' },
      skills: ['JS'],
      experience: null,
      city: 'A',
      state: 'B',
      remote: null,
      postDate: new Date(),
    },
  ];

  const configServiceMock = {
    get: jest.fn().mockReturnValue({
      first: 'http://provider1',
      second: 'http://provider2',
    }),
  };

  const httpServiceMock = {
    get: jest
      .fn()
      .mockReturnValue(
        of({ data: {} } as AxiosResponse<
          Provider1Response | Provider2Response
        >),
      ),
  };

  const jobOffersServiceMock = {
    saveMany: jest.fn().mockResolvedValue(jobDtoMock),
  };

  const provider1Mock = {
    process: jest.fn().mockReturnValue(jobDtoMock),
  };

  const provider2Mock = {
    process: jest.fn().mockReturnValue(jobDtoMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScraperService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: HttpService, useValue: httpServiceMock },
        { provide: JobOffersService, useValue: jobOffersServiceMock },
        { provide: Provider1ProcessorService, useValue: provider1Mock },
        { provide: Provider2ProcessorService, useValue: provider2Mock },
      ],
    }).compile();

    service = module.get(ScraperService);
  });

  it('should fetch, process, and save job offers', async () => {
    const result = await service.scrapeAll();

    expect(httpServiceMock.get).toHaveBeenCalledTimes(2);
    expect(provider1Mock.process).toHaveBeenCalledWith({}, 1);
    expect(provider2Mock.process).toHaveBeenCalledWith({}, 2);
    expect(jobOffersServiceMock.saveMany).toHaveBeenCalledWith([
      ...jobDtoMock,
      ...jobDtoMock,
    ]);
    expect(result).toEqual({ saved: 2 });
  });

  it('should handle one failed processor gracefully', async () => {
    provider1Mock.process.mockImplementationOnce(() => {
      throw new Error('Provider1 failed');
    });

    const result = await service.scrapeAll();

    expect(jobOffersServiceMock.saveMany).toHaveBeenCalledWith(jobDtoMock);
    expect(result).toEqual({ saved: 1 });
  });

  it('should save nothing if both processors fail', async () => {
    provider1Mock.process.mockImplementation(() => {
      throw new Error('fail');
    });
    provider2Mock.process.mockImplementation(() => {
      throw new Error('fail');
    });

    const result = await service.scrapeAll();

    expect(jobOffersServiceMock.saveMany).not.toHaveBeenCalled();
    expect(result).toEqual({ saved: 0 });
  });
});
