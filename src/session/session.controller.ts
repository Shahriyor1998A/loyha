import {
  Controller, Get, Post, Body, Patch, Param, Delete,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

 
  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one session' })
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session' })
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
