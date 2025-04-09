import configuration from '@config/configuration';
import { DataSource } from 'typeorm';
import { JobOfferDto } from '../dto/job-offer.dto';
import { JobOffer } from '../entities/job-offer.entity';

export const JobOfferRepository = (dataSource: DataSource) =>
  dataSource.getRepository(JobOffer).extend({
    async saveOffers(dtos: JobOfferDto[]): Promise<JobOffer[]> {
      await this.upsert(dtos, ['provider', 'providerId']);
      return this.find({
        where: dtos.map((d) => ({
          provider: d.provider,
          providerId: d.providerId,
        })),
      });
    },

    async getByQuery(
      filters: {
        city?: string;
        state?: string;
        remote?: boolean;
        company?: string;
        skills?: string[];
        position?: string;
      },
      page: number,
      pageSize: number,
    ): Promise<{
      data: JobOffer[];
      total: number;
      page: number;
      size: number;
    }> {
      const query = this.createQueryBuilder('job');

      if (filters.city) {
        query.andWhere('job.city ILIKE :city', { city: `%${filters.city}%` });
      }

      if (filters.state) {
        query.andWhere('job.state ILIKE :state', {
          state: `%${filters.state}%`,
        });
      }

      if (filters.remote !== undefined) {
        query.andWhere('job.remote = :remote', { remote: filters.remote });
      }

      if (filters.position) {
        query.andWhere('job.position ILIKE :position', {
          position: `%${filters.position}%`,
        });
      }

      if (filters.company) {
        // Column 'company.name' maps to 'company_name' by TypeORM
        query.andWhere('job.company_name ILIKE :company', {
          company: `%${filters.company}%`,
        });
      }

      if (filters.skills?.length) {
        query.andWhere('job.skills && ARRAY[:...skills]', {
          skills: filters.skills,
        });
      }

      // Pagination
      const finalPageSize = pageSize || configuration().pagination.size;
      const finalPage = page || configuration().pagination.page;

      const [results, total] = await query
        .skip((finalPage - 1) * finalPageSize)
        .take(finalPageSize)
        .orderBy('job.postDate', 'DESC')
        .getManyAndCount();

      return {
        data: results,
        total,
        page: finalPage,
        size: finalPageSize,
      };
    },
  });
