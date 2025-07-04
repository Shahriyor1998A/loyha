import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
