import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { DocumentsQueryDto } from './dto/documents-query.dto';
import { DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
  ) {}

  async findAll(query: DocumentsQueryDto) {
    const { q, tip, emitent, status, an, page = 1, limit = 15, sort = 'date_desc' } = query;

    // Use Elasticsearch for full-text search
    if (q) {
      return this.searchService.search({ q, tip, emitent, status, an, page, limit });
    }

    // Otherwise use Prisma with filters
    const where: any = { status: DocumentStatus.APROBAT, deletedAt: null };
    if (tip) where.type = { nameRo: { contains: tip, mode: 'insensitive' } };
    if (an) where.dateIssued = { gte: new Date(`${an}-01-01`), lt: new Date(`${Number(an)+1}-01-01`) };
    if (status) where.legalStatus = status.toUpperCase();

    const orderBy = sort === 'date_asc' ? { dateIssued: 'asc' as const } :
                    sort === 'title_asc' ? { titleRo: 'asc' as const } :
                    sort === 'title_desc' ? { titleRo: 'desc' as const } :
                    { dateIssued: 'desc' as const };

    const [total, data] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { type: true, emitent: true },
      }),
    ]);

    return {
      data: data.map(this.formatDocument),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const doc = await this.prisma.document.findFirst({
      where: { id, status: DocumentStatus.APROBAT, deletedAt: null },
      include: {
        type: true,
        emitent: true,
        publicationStatus: true,
      },
    });

    if (!doc) throw new NotFoundException(`Documentul cu id ${id} nu a fost găsit`);

    // Get all versions (same parentId or same id)
    const parentId = doc.parentId ?? doc.id;
    const versions = await this.prisma.document.findMany({
      where: { OR: [{ id: parentId }, { parentId }], status: DocumentStatus.APROBAT },
      orderBy: { version: 'asc' },
      select: { id: true, version: true, dateIssued: true, titleRo: true },
    });

    return { data: { ...this.formatDocument(doc), bodyRo: doc.bodyRo, bodyRu: doc.bodyRu, versions } };
  }

  async generatePdf(id: number, consolidated = false): Promise<Buffer> {
    const doc = await this.findOne(id);
    if (!doc.data) throw new NotFoundException();

    // In production: use Puppeteer to render an HTML template and return PDF buffer
    // For now, return a placeholder
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #0f172a; }
            h1 { color: #0f2557; font-size: 16px; }
            .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
            .body { font-size: 13px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${doc.data.titleRo}</h1>
          <div class="meta">
            Tip: ${doc.data.type} | Nr.: ${doc.data.number} | Emitent: ${doc.data.emitent}
          </div>
          <div class="body">${doc.data.bodyRo}</div>
        </body>
      </html>
    `);

    const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } });
    await browser.close();
    return Buffer.from(pdf);
  }

  private formatDocument(doc: any) {
    return {
      id: doc.id,
      titleRo: doc.titleRo,
      titleRu: doc.titleRu,
      type: doc.type?.nameRo ?? '',
      number: doc.number,
      emitent: doc.emitent?.nameRo ?? '',
      dateIssued: doc.dateIssued?.toISOString().split('T')[0] ?? '',
      datePublished: doc.datePublished?.toISOString().split('T')[0] ?? '',
      moNumber: doc.moNumber ?? '',
      status: doc.legalStatus?.toLowerCase() ?? 'in_vigoare',
      version: doc.version,
    };
  }
}
