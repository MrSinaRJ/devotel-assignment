import configuration from '@config/configuration';
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
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  remote?: boolean;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((skill: string) => skill.trim())
      : [],
  )
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size!: number;
}
