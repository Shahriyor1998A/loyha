import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCommentDto, req: string) {
    let userId = req
    return this.prisma.comment.create({
      data: {
      message: dto.message,
      userId: req,
      houseId: dto.houseId, // 👈 MUHIM: houseId ni ham berish
    },
    });
  }

  async findAll(userid: string) {
    return this.prisma.comment.findMany({
      include: { user: true, House: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, req: Request, dto: UpdateCommentDto) {
    let userId = req['user-id']
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }

    return this.prisma.comment.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, req: Request) {
    let userId = req['user-id']

    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
