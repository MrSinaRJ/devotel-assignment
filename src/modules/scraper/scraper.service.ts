import { AppConfig } from '@config/configuration';
import { JobOfferDto } from '@job-offers/dto/job-offer.dto';
import { JobOffersService } from '@job-offers/job-offers.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Provider1ProcessorService } from './processors/provider1-processor.service';
import { Provider2ProcessorService } from './processors/provider2-processor.service';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly url1: string;
  private readonly url2: string;

  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly http: HttpService,
    private readonly jobOffersService: JobOffersService,
    private readonly provider1: Provider1ProcessorService,
    private readonly provider2: Provider2ProcessorService,
  ) {
    const urls = this.configService.get('urls', { infer: true });
    this.url1 = urls.first;
    this.url2 = urls.second;
  }

  async scrapeAll() {
    this.logger.log('Starting scraping from all providers');

    const [res1, res2] = await Promise.allSettled([
      this.fetchAndProcess(this.url1, this.provider1, 1),
      this.fetchAndProcess(this.url2, this.provider2, 2),
    ]);

    const results = [
      ...(res1.status === 'fulfilled' ? res1.value : []),
      ...(res2.status === 'fulfilled' ? res2.value : []),
    ];

    if (results.length > 0) {
      await this.jobOffersService.saveMany(results);
      this.logger.log(`Saved ${results.length} job offers`);
    } else {
      this.logger.warn('No job offers saved (either failed or empty)');
    }

    return { saved: results.length };
  }

  private async fetchAndProcess(
    url: string,
    processor: { process(data: any, providerId: number): JobOfferDto[] },
    providerId: number,
  ) {
    this.logger.log(`Fetching from provider ${providerId}`);
    const response = await firstValueFrom<AxiosResponse<any>>(
      this.http.get(url),
    );
    return processor.process(response.data, providerId);
  }
}
