import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private readonly jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let token = request.headers.authorization?.split(' ')?.[1]

    if(!token){
      throw new UnauthorizedException({message:"Token not provided"})
    }
    
    try {
      let data = this.jwt.verify(token, {secret: process.env.TOKEN_KEY_ACCESS});
     
      request['user-id'] = data.id;
      request['user-role'] = data.role;
      return true;
    } catch (error) {
      throw new UnauthorizedException({message: "Wrong cr,n,m.edentials!"})
    }
  }
}



// // src/user/guard/auth.guard.ts
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private prisma: PrismaService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const authHeader = request.headers.authorization;

//     if (!authHeader) {
//       throw new UnauthorizedException('Token topilmadi');
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//       const payload = await this.jwtService.verifyAsync(token);
//       const user = await this.prisma.user.findUnique({
//         where: { id: payload.sub },
//       });

//       if (!user) {
//         throw new UnauthorizedException('Foydalanuvchi topilmadi');
//       }

//       request.user = user; 

//       return true;
//     } catch (error) {
//       throw new UnauthorizedException('Token noto‘g‘ri yoki muddati tugagan');
//     }
//   }
// }
