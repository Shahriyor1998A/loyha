import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bu uy juda yoqdi!' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  houseId: string;
}
