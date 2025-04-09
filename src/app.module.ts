import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './common/utils/config.util';
import configuration, { AppConfig } from './config/configuration';
import { HealthModule } from './modules/health/health.module';
import { JobOffersModule } from './modules/job-offers/job-offers.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { ScraperModule } from './modules/scraper/scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot<AppConfig>({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => {
        const pg = getConfig(config, 'postgresql');
        const app = getConfig(config, 'app');
        return {
          type: 'postgres',
          host: pg.host,
          port: pg.port,
          username: pg.username,
          password: pg.password,
          database: pg.database,
          autoLoadEntities: true,
          synchronize: app.env === 'dev',
        };
      },
    }),
    HealthModule,
    ScraperModule,
    SchedulerModule,
    JobOffersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
