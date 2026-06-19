import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } });
  }

  async create(dto: RegisterDto) {
    const exists = await this.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email-ul este deja înregistrat');
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, password: hashed },
      select: { id: true, email: true, name: true, role: true },
    });
    return { data: user };
  }

  async addFavorite(userId: number, documentId: number) {
    await this.prisma.favorite.upsert({
      where: { userId_documentId: { userId, documentId } },
      create: { userId, documentId },
      update: {},
    });
    return { message: 'Adăugat la favorite' };
  }

  async removeFavorite(userId: number, documentId: number) {
    await this.prisma.favorite.deleteMany({ where: { userId, documentId } });
    return { message: 'Eliminat din favorite' };
  }

  async getFavorites(userId: number) {
    const favs = await this.prisma.favorite.findMany({
      where: { userId },
      include: { document: { include: { type: true, emitent: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data: favs.map(f => f.document) };
  }
}
