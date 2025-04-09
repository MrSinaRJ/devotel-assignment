import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';
import { JobOfferQueryDto } from './dto/job-offer-query.dto';
import { JobOffer } from './entities/job-offer.entity';

describe('JobOffersController', () => {
  let controller: JobOffersController;
  let service: {
    getById: jest.Mock;
    getByQuery: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getById: jest.fn(),
      getByQuery: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOffersController],
      providers: [
        {
          provide: JobOffersService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get(JobOffersController);
  });

  it('should call getById with correct ID', async () => {
    const mockJob = { id: 123 } as JobOffer;
    service.getById.mockResolvedValue(mockJob);

    const result = await controller.getById(123);
    expect(result).toBe(mockJob);
    expect(service.getById).toHaveBeenCalledWith(123);
  });

  it('should call getByQuery with correct filters', async () => {
    const query: JobOfferQueryDto = {
      city: 'San Francisco',
      page: 1,
      size: 10,
    };
    const mockResult = {
      data: [],
      total: 0,
      page: 1,
      size: 10,
    };
    service.getByQuery.mockResolvedValue(mockResult);

    const result = await controller.getByQuery(query);
    expect(result).toEqual(mockResult);
    expect(service.getByQuery).toHaveBeenCalledWith(query);
  });
});
