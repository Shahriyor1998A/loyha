import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateHouseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  images: string[];

  @ApiProperty({ enum: Status, required: false })
  @IsOptional()
  status?: Status;

  @ApiProperty()
  @IsString()
  regionId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
