import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Toshkent', description: 'Region nomi (uz)' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Ташкент', description: 'Region nomi (ru)' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: 'Tashkent', description: 'Region nomi (en)' })
  @IsString()
  @IsNotEmpty()
  name_en: string;
}
