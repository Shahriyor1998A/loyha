import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateFavoriteDto, req: string) {
    try {
      const userId = req;

      if (!userId) {
        throw new BadRequestException('Foydalanuvchi aniqlanmadi');
      }

      const house = await this.prisma.house.findUnique({
        where: { id: dto.houseId },
      });

      if (!house) {
        throw new NotFoundException('Uy topilmadi');
      }

      const existing = await this.prisma.favorite.findFirst({
        where: {
          houseId: dto.houseId,
          userId,
        },
      });

      if (existing) {
        throw new BadRequestException('Bu uy allaqachon sevimlilar ro‘yxatida');
      }

      return this.prisma.favorite.create({
        data: {
          houseId: dto.houseId,
          userId,
        },
      });
    } catch (error) {
      throw new BadRequestException({
        message: error.message || 'Xatolik yuz berdi',
      });
    }
  }

  async findAll(userId: string) {
    try {
      return await this.prisma.favorite.findMany({
        where: { userId },
        include: { house: true },
      });
    } catch (error) {
      throw new BadRequestException({
        message: error.message || 'Sevimli ularni olishda xatolik yuz berdi',
      });
    }
  }

  async remove(id: string, userId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!fav || fav.userId !== userId) {
      throw new NotFoundException('Sevimli uy topilmadi yoki sizga tegishli emas');
    }

    return this.prisma.favorite.delete({
      where: { id },
    });
  }
}
