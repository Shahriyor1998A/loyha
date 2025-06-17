import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

 
  findAll() {
    return this.prisma.session.findMany({
      include: { user: true },
    });
  }

 
  findOne(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: { user: true },
    });
  }

 
  async remove(id: string) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session topilmadi');

    return this.prisma.session.delete({ where: { id } });
  }
}
