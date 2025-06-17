import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({ secret: process.env.TOKEN_KEY_ACCESS })],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService, JwtStrategy],
})
export class UserModule {}
