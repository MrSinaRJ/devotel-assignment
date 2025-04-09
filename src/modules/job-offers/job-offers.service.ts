import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JobOfferQueryDto } from './dto/job-offer-query.dto';
import { JobOfferDto } from './dto/job-offer.dto';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferRepository } from './repositories/job-offer.repository';

@Injectable()
export class JobOffersService {
  private readonly logger = new Logger(JobOffersService.name);

  constructor(
    @Inject('JOB_OFFER_REPOSITORY')
    private readonly _jobOfferRepository: ReturnType<typeof JobOfferRepository>,
  ) {}

  async getById(id: number): Promise<JobOffer> {
    const job = await this._jobOfferRepository.findOne({ where: { id } });
    if (!job) {
      this.logger.error(`JobOffer with id ${id} not found.`);
      throw new NotFoundException(`JobOffer with id ${id} not found.`);
    }
    return job;
  }

  async getByQuery(
    filters: JobOfferQueryDto,
  ): Promise<{ data: JobOffer[]; total: number; page: number; size: number }> {
    this.logger.debug(
      `Retrieving job offers with filters: ${JSON.stringify(filters)}`,
    );

    return await this._jobOfferRepository.getByQuery(
      filters,
      filters.page,
      filters.size,
    );
  }

  async saveMany(dtos: JobOfferDto[]): Promise<JobOffer[]> {
    try {
      return await this._jobOfferRepository.saveOffers(dtos);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error saving job offers: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Error saving job offers: ${error.message}`,
        );
      } else {
        this.logger.error(`Error saving job offers: ${String(error)}`);
        throw new InternalServerErrorException(
          `Error saving job offers: ${String(error)}`,
        );
      }
    }
  }
}
