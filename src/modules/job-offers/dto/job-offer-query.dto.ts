import configuration from '@config/configuration';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class JobOfferQueryDto {
  @ApiProperty({
    description: 'Filter by city name (case-insensitive, partial match)',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Filter by state name (case-insensitive, partial match)',
    required: false,
    example: 'CA',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Filter by remote work possibility',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  remote?: boolean;

  @ApiProperty({
    description:
      'Filter by job position/title (case-insensitive, partial match)',
    required: false,
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: 'Filter by company name (case-insensitive, partial match)',
    required: false,
    example: 'Google',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    description: 'Filter by required skills (comma-separated)',
    required: false,
    type: String,
    example: 'JavaScript, TypeScript',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((skill: string) => skill.trim())
      : [],
  )
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    description: 'Page number for pagination (min: 1)',
    required: false,
    type: Number,
    minimum: 1,
    default: configuration().pagination.page,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @ApiProperty({
    description: 'Number of items per page (min: 1)',
    required: false,
    type: Number,
    minimum: 1,
    default: configuration().pagination.size,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size!: number;
}
