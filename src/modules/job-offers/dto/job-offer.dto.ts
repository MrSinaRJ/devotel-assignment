import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  website?: string | null;

  @IsOptional()
  @IsString()
  industry?: string | null;
}

export class CompensationDto {
  @IsNumber()
  min!: number;

  @IsNumber()
  max!: number;

  @IsString()
  currency!: string;
}

export class JobOfferDto {
  @IsInt()
  provider!: number;

  @IsString()
  providerId!: string;

  @IsString()
  position!: string;

  @ValidateNested()
  @Type(() => CompanyDto)
  company!: CompanyDto;

  @ValidateNested()
  @Type(() => CompensationDto)
  compensation!: CompensationDto;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number | null;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsOptional()
  @IsBoolean()
  remote?: boolean | null;

  @IsDate()
  @Type(() => Date)
  postDate!: Date;
}
