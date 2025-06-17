import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateRegionDto) {
    try {
      const existingRegion = await this.prisma.region.findFirst({
        where: {
          OR: [
            { name_uz: data.name_uz },
            { name_ru: data.name_ru },
            { name_en: data.name_en },
          ],
        },
      });

      if (existingRegion)
        throw new BadRequestException({ message: 'Region already exists!' });

      const newRegion = await this.prisma.region.create({
        data: {
          name_uz: data.name_uz,
          name_ru: data.name_ru,
          name_en: data.name_en,
        },
      });

      return newRegion;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'name_uz' | 'name_ru' | 'name_en';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search = '',
        sort = 'asc',
        sortBy = 'name_uz',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where: Prisma.RegionWhereInput = search
        ? {
          OR: [
            {
              name_uz: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              name_ru: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              name_en: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
        : {};


      const regions = await this.prisma.region.findMany({
        where,
        orderBy: {
          [sortBy]: sort,
        },
        skip,
        take,
      });

      const total = await this.prisma.region.count({ where });

      return {
        data: regions,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Regions not exists yet!');
    }
  }




  async findOne(id: string) {
    try {
      const region = await this.prisma.region.findFirst({ where: { id } });
      if (!region) {
        throw new NotFoundException({ message: 'Region not found. Try again!' });
      }
      return region;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      await this.findOne(id);
      const updatedRegion = await this.prisma.region.update({
        where: { id },
        data: {
          name_uz: data.name_uz,
          name_ru: data.name_ru,
          name_en: data.name_en,
        },
      });
      return updatedRegion;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      const deletedRegion = await this.prisma.region.delete({ where: { id } });
      return deletedRegion;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
