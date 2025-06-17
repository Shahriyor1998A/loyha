import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { Request } from 'express';

@ApiTags('Sevimlilar')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @ApiOperation({ summary: 'Sevimliga uy qo‘shish' })
  @ApiResponse({ status: 201, description: 'Uy sevimlilar ro‘yxatiga qo‘shildi.' })
  @ApiResponse({ status: 400, description: 'Uy allaqachon sevimlilar ro‘yxatida yoki topilmadi.' })
  @Post()
  create(
    @Body() dto: CreateFavoriteDto,
    @Req() req: Request
  ) {
    return this.favoriteService.create(dto, req['user-id']);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha sevimli uylari ro‘yxati' })
  @ApiResponse({ status: 200, description: 'Sevimli uylar muvaffaqiyatli qaytarildi.' })
  findAll(@Req() req: Request) {
    return this.favoriteService.findAll(req['user-id']);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Sevimlidan uyni olib tashlash' })
  @ApiParam({ name: 'id', description: 'Sevimli uyning IDsi' })
  @ApiResponse({ status: 200, description: 'Uy sevimlilar ro‘yxatidan olib tashlandi.' })
  @ApiResponse({ status: 404, description: 'Uy topilmadi yoki sizga tegishli emas.' })
  remove(
    @Param('id') id: string,
    @User('id') userId: string,
  ) {
    return this.favoriteService.remove(id, userId);
  }
}
