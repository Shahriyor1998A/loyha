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
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) { }

  @Post()
  @ApiOperation({ summary: 'Yangi region yaratish' })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

 @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name_uz', 'name_ru', 'name_en'],
    example: 'name_uz',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'name_uz' | 'name_ru' | 'name_en',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.regionService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }



  @Get(':id')
  @ApiOperation({ summary: 'ID orqali bitta regionni olish' })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Regionni yangilash' })
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Regionni o`chirish' })
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
