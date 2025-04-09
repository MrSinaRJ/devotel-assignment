import { JobOffersModule } from '@job-offers/job-offers.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Provider1ProcessorService } from './processors/provider1-processor.service';
import { Provider2ProcessorService } from './processors/provider2-processor.service';
import { ScraperService } from './scraper.service';

@Module({
  imports: [HttpModule, JobOffersModule],
  providers: [
    ScraperService,
    Provider1ProcessorService,
    Provider2ProcessorService,
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
