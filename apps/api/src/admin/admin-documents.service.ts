import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AdminDocumentsService {
  constructor(private prisma: PrismaService, private events: EventEmitter2) {}

  async findAll(params: any) {
    const { q, status, page = 1, limit = 20 } = params;
    const where: any = { deletedAt: null };
    if (status) where.status = status.toUpperCase();
    if (q) where.titleRo = { contains: q, mode: 'insensitive' };

    const [total, data] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where, skip: (page-1)*limit, take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { type: true, emitent: true },
      }),
    ]);

    return { data, meta: { total, page, limit, pages: Math.ceil(total/limit) } };
  }

  async create(dto: CreateDocumentDto, userId: number) {
    const doc = await this.prisma.document.create({
      data: { ...dto, createdById: userId, status: DocumentStatus.INCOMPLET },
    });
    await this.log(doc.id, userId, 'CREATE');
    return { data: doc };
  }

  async update(id: number, dto: UpdateDocumentDto, userId: number) {
    const doc = await this.findOrFail(id);
    const updated = await this.prisma.document.update({ where: { id }, data: dto });
    await this.log(id, userId, 'UPDATE');
    return { data: updated };
  }

  async approve(id: number, userId: number) {
    const doc = await this.findOrFail(id);
    const updated = await this.prisma.document.update({
      where: { id }, data: { status: DocumentStatus.APROBAT },
    });
    await this.log(id, userId, 'APPROVE');
    this.events.emit('document.approved', updated);
    return { data: updated };
  }

  async unapprove(id: number, userId: number) {
    await this.findOrFail(id);
    const updated = await this.prisma.document.update({
      where: { id }, data: { status: DocumentStatus.DEZAPROBAT },
    });
    await this.log(id, userId, 'UNAPPROVE');
    return { data: updated };
  }

  async softDelete(id: number, userId: number) {
    await this.findOrFail(id);
    const updated = await this.prisma.document.update({
      where: { id }, data: { status: DocumentStatus.STERS, deletedAt: new Date() },
    });
    await this.log(id, userId, 'DELETE');
    return { data: updated };
  }

  private async findOrFail(id: number) {
    const doc = await this.prisma.document.findFirst({ where: { id, deletedAt: null } });
    if (!doc) throw new NotFoundException(`Document ${id} nu a fost găsit`);
    return doc;
  }

  private async log(documentId: number, userId: number, action: string) {
    await this.prisma.documentLog.create({ data: { documentId, userId, action } });
  }
}
