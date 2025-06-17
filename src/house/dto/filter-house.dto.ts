import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class FilterHouseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  regionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
