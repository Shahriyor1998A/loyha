import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { FilterHouseDto } from './dto/filter-house.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('House')
@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create new house' })
  create(@Body() createHouseDto: CreateHouseDto) {
    return this.houseService.create(createHouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all houses with filters' })
  findAll(@Query() filter: FilterHouseDto) {
    return this.houseService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get house by ID' })
  findOne(@Param('id') id: string) {
    return this.houseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update house by ID' })
  update(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
    return this.houseService.update(id, updateHouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete house by ID' })
  remove(@Param('id') id: string) {
    return this.houseService.remove(id);
  }
}
