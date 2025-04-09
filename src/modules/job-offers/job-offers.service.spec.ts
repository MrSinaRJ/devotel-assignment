import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferQueryDto } from './dto/job-offer-query.dto';
import { JobOfferDto } from './dto/job-offer.dto';
import { JobOffer } from './entities/job-offer.entity';
import { JobOffersService } from './job-offers.service';

describe('JobOffersService', () => {
  let service: JobOffersService;
  let repo: {
    findOne: jest.Mock;
    getByQuery: jest.Mock;
    saveOffers: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      getByQuery: jest.fn(),
      saveOffers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOffersService,
        {
          provide: 'JOB_OFFER_REPOSITORY',
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(JobOffersService);
  });

  it('should return a job offer by ID', async () => {
    const mockJob = { id: 1 } as JobOffer;
    repo.findOne.mockResolvedValue(mockJob);

    const result = await service.getById(1);
    expect(result).toBe(mockJob);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw if job offer not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.getById(-1)).rejects.toThrow(
      'JobOffer with id -1 not found',
    );
  });

  it('should call getByQuery and return paginated results', async () => {
    const query: JobOfferQueryDto = { page: 1, size: 10 };
    const mockResponse = { data: [], total: 0, page: 1, size: 10 };
    repo.getByQuery.mockResolvedValue(mockResponse);

    const result = await service.getByQuery(query);
    expect(result).toEqual(mockResponse);
    expect(repo.getByQuery).toHaveBeenCalledWith(query, 1, 10);
  });

  it('should save offers via repository', async () => {
    const dtos: JobOfferDto[] = [
      {
        provider: 1,
        providerId: 'a',
        position: 'Dev',
        company: { name: 'X' },
        compensation: { min: 1, max: 2, currency: 'USD' },
        skills: [],
        city: 'Y',
        state: 'Z',
        postDate: new Date(),
      },
    ];
    const saved = dtos.map((dto) => ({ ...dto, id: 1 }));
    repo.saveOffers.mockResolvedValue(saved);

    const result = await service.saveMany(dtos);
    expect(result).toEqual(saved);
    expect(repo.saveOffers).toHaveBeenCalledWith(dtos);
  });
});
