import { AppConfig } from '@config/configuration';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ScraperService } from '@scraper/scraper.service';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly _configService: ConfigService<AppConfig, true>,
    private readonly _scraperService: ScraperService,
    private readonly _schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const cronExpression =
      this._configService.get('frequency') || CronExpression.EVERY_HOUR;

    const job = new CronJob(cronExpression, async () => {
      try {
        this.logger.log(`Running scheduled scrape via cron: ${cronExpression}`);
        await this._scraperService.scrapeAll();
      } catch (err) {
        this.logger.error('Error during scheduled scrape', err);
      }
    });

    this._schedulerRegistry.addCronJob('scrapeJob', job);
    job.start();

    this.logger.log(
      `Scheduled scrape job initialized with cron: ${cronExpression}`,
    );
  }

  async runManually() {
    this.logger.warn('Scrape triggered manually');
    return this._scraperService.scrapeAll();
  }
}
