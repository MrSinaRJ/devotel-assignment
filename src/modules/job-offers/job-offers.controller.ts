import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JobOfferQueryDto } from './dto/job-offer-query.dto';
import { JobOffer } from './entities/job-offer.entity';
import { JobOffersService } from './job-offers.service';

@ApiExtraModels(JobOffer)
@ApiTags('Job Offers')
@Controller({ path: 'job-offers', version: '1' })
export class JobOffersController {
  constructor(private readonly _jobOffersService: JobOffersService) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this._jobOffersService.getById(id);
  }

  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query parameters for searching job offers',
    type: JobOfferQueryDto,
  })
  @ApiOkResponse({
    description: 'Job offers fetched successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(JobOffer) },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        size: { type: 'number', example: 10 },
      },
    },
  })
  @Get()
  getByQuery(
    @Query() query: JobOfferQueryDto,
  ): Promise<{ data: JobOffer[]; total: number; page: number; size: number }> {
    return this._jobOffersService.getByQuery(query);
  }
}
