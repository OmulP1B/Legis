import { Controller, Get, Param, Query, ParseIntPipe, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { DocumentsQueryDto } from './dto/documents-query.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista documente cu filtrare și paginare' })
  findAll(@Query() query: DocumentsQueryDto) {
    return this.documentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalii document cu versiuni' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Generare și descărcare PDF' })
  async downloadPdf(
    @Param('id', ParseIntPipe) id: number,
    @Query('consolidated') consolidated: string,
    @Res() res: any,
  ) {
    const pdfBuffer = await this.documentsService.generatePdf(id, consolidated === 'true');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="document-${id}.pdf"`,
    });
    res.end(pdfBuffer);
  }
}
