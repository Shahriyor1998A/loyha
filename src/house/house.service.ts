import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { FilterHouseDto } from './dto/filter-house.dto';

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHouseDto: CreateHouseDto) {
    
    return await this.prisma.house.create({
      data: createHouseDto,
    });
  }

  async findAll(filter: FilterHouseDto) {
    const houses = await this.prisma.house.findMany({
      where: {
        status: filter?.status,
        price: {
          gte: filter?.minPrice,
          lte: filter?.maxPrice,
        },
        regionId: filter?.regionId,
      },
      include: {
        region: true,
        user: true,
      },
    });
    return houses;
  }

  async findOne(id: string) {
    const house = await this.prisma.house.findUnique({
      where: { id },
      include: { region: true, user: true },
    });

    if (!house) throw new NotFoundException('House not found');
    return house;
  }

  async update(id: string, updateHouseDto: UpdateHouseDto) {
    return await this.prisma.house.update({
      where: { id },
      data: updateHouseDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.house.delete({
      where: { id },
    });
  }
}
