import { JwtModule } from "@nestjs/jwt";
import { CommentModule } from "./comment/comment.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { HouseModule } from "./house/house.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { RegionModule } from "./region/region.module";
import { MailService } from "./user/mail.service";
import { UserModule } from "./user/user.module";
import { UserService } from "./user/user.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { SessionController } from "./session/session.controller";
import { SessionService } from "./session/session.service";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      }),
    JwtModule.register({
      global: true,   
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    PrismaModule,
    UserModule,
    HouseModule,
    RegionModule,
    CommentModule,
    FavoriteModule,
  ],
   controllers: [SessionController],
  providers: [UserService, PrismaService, MailService,SessionService],
  
})
export class AppModule {}
