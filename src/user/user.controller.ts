import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendOtpEmailDto } from './dto/send-otp-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateAdminrDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from './decorators/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { Roles } from './decorators/role.decorator';
import { RoleGuard } from './guard/role.guard';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from './guard/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    try {
      return await this.userService.register(dto);
    } catch (error) {
      throw new BadRequestException('Ro`yxatdan o`tkazishda xatolik: ' );
    }
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Req() req: Request) {
    try {
      return await this.userService.login(dto, req);
    } catch (error) {
      throw new BadRequestException('Kirishda xatolik: ' );
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    try {
      return await this.userService.verifyRefreshToken(dto);
    } catch (error) {
      throw new BadRequestException('Refresh token xato: ' );
    }
  }

  @Post('otp/send')
  async sendOtp(@Body() dto: SendOtpEmailDto) {
    try {
      return await this.userService.sendOtpEmail(dto);
    } catch (error) {
      console.log(error);
      
      throw new BadRequestException('OTP yuborishda xatolik: ' );
    }
  }

  @Post('otp/verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    try {
      return await this.userService.verifyOtp(dto);
    } catch (error) {
      throw new BadRequestException('OTP tekshirishda xatolik: ' );
    }
  }

  @Post('password/reset-request')
  async resetEmail(@Body() dto: ResetPasswordEmailDto) {
    try {
      return await this.userService.sendResetPasswordEmail(dto);
    } catch (error) {
      throw new BadRequestException('Parol tiklash uchun OTP yuborishda xatolik: ');
    }
  }

  @Post('password/reset')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      return await this.userService.resetPassword(dto);
    } catch (error) {
      throw new BadRequestException('Parolni o‘zgartirishda xatolik: ' );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@GetUser('id') userId: string) {
    try {
      return await this.userService.me(userId);
    } catch (error) {
      throw new NotFoundException('Foydalanuvchi topilmadi: ' );
    }
  }

  @Post('admin/create')
  async createAdmin(@Body() dto: CreateAdminrDto) {
    try {
      return await this.userService.createAdmin(dto);
    } catch (error) {
      throw new BadRequestException('Admin yaratishda xatolik: ' );
    }
  }

  @Delete('admin/:id')
  async deleteAdmin(@Param('id') id: string) {
    try {
      return await this.userService.deleteAdmin(id);
    } catch (error) {
      throw new BadRequestException('Adminni o`chirishda xatolik: ' );
    }
  }

  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'fullname', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query() query: any) {
    try {
      return await this.userService.findAll(query);
    } catch (error) {
      throw new BadRequestException('Foydalanuvchilarni olishda xatolik: ' );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Foydalanuvchi topilmadi: ' );
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  async update(@Req() req:Request, @Body() dto: UpdateUserDto) {
    try {
      return await this.userService.update(req, dto);
    } catch (error) {
      throw new BadRequestException('Foydalanuvchini yangilashda xatolik: ' );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw new BadRequestException('Foydalanuvchini o`chirishda xatolik: ' );
    }
  }
}
