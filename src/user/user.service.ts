import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateAdminrDto } from './dto/create-admin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto';
import { SendOtpEmailDto } from './dto/send-otp-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ) {}

  private genAccToken(payload: { id: string; role: string }) {
    return this.jwt.sign(payload, { expiresIn: '15m' });
  }

  private generateRefreshToken(payload: { id: string; role: string }) {
    return this.jwt.sign(payload, {
      secret: process.env.TOKEN_KEY_REFRESH,
      expiresIn: '7d',
    });
  }

  private async checkEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  private async checkPhone(phone: string) {
    return this.prisma.user.findFirst({ where: { phone } });
  }

  async verifyRefreshToken(dto: RefreshTokenDto) {
    try {
      const data = this.jwt.verify(dto.token, {
        secret: process.env.TOKEN_KEY_REFRESH,
      });
      return { accessToken: this.genAccToken({ id: data.id, role: data.role }) };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async sendOtpEmail(dto: SendOtpEmailDto) {
    const user = await this.checkEmail(dto.email);
    if (user) throw new BadRequestException('Email already exists!');

    const otp = this.mail.createOtp(dto.email);
    await this.mail.sendEmail(
      dto.email,
      'ONE-TIME PASSWORD',
      `<h4>Your login password is <h3><u>${otp}</u></h3>. It is valid for 2 minutes.</h4>`,
    );
    return { message: 'OTP sent successfully' };
  }

  verifyOtp(dto: VerifyOtpDto) {
    const isMatch = this.mail.checkOtp(dto.otp, dto.email);
    return { result: isMatch };
  }

  async register(dto: CreateUserDto) {
    if (await this.checkEmail(dto.email)) throw new BadRequestException('Email already exists!');
    if (await this.checkPhone(dto.phone)) throw new BadRequestException('Phone number already exists!');

    const region = await this.prisma.region.findFirst({ where: { id: dto.regionId } });
    if (!region) throw new NotFoundException('Region not found!');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...dto, password: hash },
    });
    
    return user;
  }

  async login(dto: LoginUserDto, req: Request) {
    const user = await this.checkEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new BadRequestException('Wrong credentials!');

    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const deviceData = req.headers['user-agent'] || 'unknown';

    const session = await this.prisma.session.findFirst({
      where: { userId: user.id, ipAddress },
    });

    if (!session) {
      await this.prisma.session.create({
        data: {
          userId: user.id,
          ipAddress, 
          deviceData,
        },
      });
    }

    const payload = { id: user.id, role: user.role };
    return {
      accessToken: this.genAccToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const isMatch = this.mail.checkOtp(dto.otp, dto.email);
    if (!isMatch) throw new BadRequestException('Invalid or expired OTP');

    const user = await this.checkEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { message: 'Password has been successfully reset.' };
  }

  async sendResetPasswordEmail(dto: ResetPasswordEmailDto) {
    const user = await this.checkEmail(dto.email);
    if (!user) throw new NotFoundException('User not found!');

    const otp = this.mail.createOtp(dto.email);
    await this.mail.sendEmail(
      dto.email,
      'Password Reset Request',
      `<h4>Your password reset code is <h3><u>${otp}</u></h3>. It is valid for 2 minutes.</h4>`,
    );

    return { message: 'OTP sent successfully' };
  }

  async me(id: string) {
    return this.prisma.user.findFirst({
      where: { id },
      include: { region: true },
    });
  }

  async findAll(params: {
    page: number;
    limit: number;
    fullname?: string;
    email?: string;
    phone?: string;
    regionId?: string;
    role?: UserRole;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page,
      limit,
      fullname,
      email,
      phone,
      regionId,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (fullname) where.fullname = { contains: fullname, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (phone) where.phone = { contains: phone, mode: 'insensitive' };
    if (regionId) where.regionId = regionId;
    if (role) where.role = role;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { region: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: { region: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(req: Request, dto: UpdateUserDto) {
    let id = req['user-id']
    console.log(id);
    
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async createAdmin(dto: CreateAdminrDto) {
    if (await this.checkEmail(dto.email)) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        fullname: dto.fullname,
        email: dto.email,
        password: hash,
        role: dto.role,
        phone: dto.phone,
      },
    });
  }

  async deleteAdmin(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
