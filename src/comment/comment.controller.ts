import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../user/guard/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateCommentDto })
  create(@Req() req: Request, @Body() dto: CreateCommentDto) {
    return this.commentService.create(dto, req['user-id']);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'List of all comments' })
  findAll(@Req() req: Request) {
    return this.commentService.findAll(req['user-id']);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment found' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, req, dto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.commentService.remove(id, req);
  }
}
