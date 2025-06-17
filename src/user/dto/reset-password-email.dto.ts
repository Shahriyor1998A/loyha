import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
