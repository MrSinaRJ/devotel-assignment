import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';
import { JobOfferRepository } from './repositories/job-offer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer])],
  controllers: [JobOffersController],
  providers: [
    JobOffersService,
    {
      provide: 'JOB_OFFER_REPOSITORY',
      inject: [DataSource],
      useFactory: JobOfferRepository,
    },
  ],
  exports: [JobOffersService],
})
export class JobOffersModule {}
