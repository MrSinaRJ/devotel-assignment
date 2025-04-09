import { JobOfferDto } from '@job-offers/dto/job-offer.dto';
import { Injectable } from '@nestjs/common';
import { Provider2Job, Provider2Response } from '../dto/provider2-job.dto';

@Injectable()
export class Provider2ProcessorService {
  process(data: Provider2Response, providerId: number): JobOfferDto[] {
    const jobsMap = data?.data?.jobsList;
    if (!jobsMap || typeof jobsMap !== 'object') {
      throw new Error(
        'Provider 2 response format invalid: jobsList must be a record.',
      );
    }

    return Object.entries(jobsMap).map(
      ([jobId, job]: [string, Provider2Job]): JobOfferDto => {
        if (
          !job.position ||
          !job.location?.city ||
          !job.location?.state ||
          !job.compensation ||
          !job.employer?.companyName ||
          !job.datePosted
        ) {
          throw new Error(
            `Invalid job entry from Provider 2: missing required fields in jobId ${jobId}`,
          );
        }

        return {
          provider: providerId,
          providerId: jobId,
          position: job.position,
          company: {
            name: job.employer.companyName,
            website: job.employer.website ?? null,
            industry: null,
          },
          compensation: {
            min: job.compensation.min,
            max: job.compensation.max,
            currency: job.compensation.currency || 'USD',
          },
          skills: Array.isArray(job.requirements?.technologies)
            ? job.requirements.technologies
            : [],
          experience: job.requirements?.experience ?? null,
          city: job.location.city,
          state: job.location.state,
          remote: job.location.remote ?? null,
          postDate: new Date(job.datePosted),
        };
      },
    );
  }
}
