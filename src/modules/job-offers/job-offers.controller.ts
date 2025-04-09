import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { JobOfferQueryDto } from './dto/job-offer-query.dto';
import { JobOffersService } from './job-offers.service';

@Controller({ path: 'job-offers', version: '1' })
export class JobOffersController {
  constructor(private readonly _jobOffersService: JobOffersService) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this._jobOffersService.getById(id);
  }

  @Get()
  getByQuery(@Query() query: JobOfferQueryDto) {
    return this._jobOffersService.getByQuery(query);
  }
}
