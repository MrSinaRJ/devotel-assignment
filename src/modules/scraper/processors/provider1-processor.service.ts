import { JobOfferDto } from '@job-offers/dto/job-offer.dto';
import { Injectable } from '@nestjs/common';
import { Provider1Job, Provider1Response } from '../dto/provider1-job.dto';

@Injectable()
export class Provider1ProcessorService {
  process(data: Provider1Response, providerId: number): JobOfferDto[] {
    if (!Array.isArray(data?.jobs)) {
      throw new Error(
        'Provider 1 response format invalid: jobs must be an array.',
      );
    }

    return data.jobs.map((job: Provider1Job): JobOfferDto => {
      if (
        !job.jobId ||
        !job.title ||
        !job.details?.location ||
        !job.details?.salaryRange ||
        !job.company?.name ||
        !job.postedDate
      ) {
        throw new Error(
          `Invalid job entry from Provider 1: missing required fields in jobId ${job.jobId}`,
        );
      }

      const [city, state] = job.details.location
        .split(',')
        .map((x) => x.trim());
      const [min, max, currency] = this.parseSalaryRange(
        job.details.salaryRange,
      );

      return {
        provider: providerId,
        providerId: job.jobId,
        position: job.title,
        company: {
          name: job.company.name,
          website: null,
          industry: job.company.industry ?? null,
        },
        compensation: { min, max, currency },
        skills: Array.isArray(job.skills) ? job.skills : [],
        experience: null,
        city,
        state,
        remote: null,
        postDate: new Date(job.postedDate),
      };
    });
  }

  private parseSalaryRange(range: string): [number, number, string] {
    const cleaned = range.replace(/,/g, '');
    const match = cleaned.match(
      /([^\d\s]+)?\s*(\d+(?:[kK])?)\s*-\s*([^\d\s]+)?\s*(\d+(?:[kK])?)/,
    );
    if (!match) throw new Error(`Unable to parse salary range: "${range}"`);

    const symbol = match[1] || match[3] || '$';
    const min = this.normalizeAmount(match[2]);
    const max = this.normalizeAmount(match[4]);
    const currency = this.symbolToCurrency(symbol);

    return [min, max, currency];
  }

  private normalizeAmount(raw: string): number {
    return raw.toLowerCase().endsWith('k')
      ? parseInt(raw.replace(/[^\d]/g, ''), 10) * 1000
      : parseInt(raw.replace(/[^\d]/g, ''), 10);
  }

  private symbolToCurrency(symbol: string): string {
    const map: Record<string, string> = {
      $: 'USD',
      '€': 'EUR',
      '£': 'GBP',
      '₹': 'INR',
      '¥': 'JPY',
      '₩': 'KRW',
    };
    return map[symbol] || 'USD';
  }
}
