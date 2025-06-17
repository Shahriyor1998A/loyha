import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 'f3d4e985-a1d7-4a5b-91a6-8a4579a6b9f2',
    description: 'Sevimlilarga qo‘shilayotgan uyning IDsi',
  })
  @IsUUID()
  houseId: string;
}
