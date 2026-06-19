import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminDocumentsService } from './admin-documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('admin')
@Controller('admin/documents')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminDocumentsController {
  constructor(private readonly service: AdminDocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista documente admin' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Post()
  @ApiOperation({ summary: 'Creare document nou' })
  create(@Body() dto: CreateDocumentDto, @Req() req: any) { return this.service.create(dto, req.user.id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizare document' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDocumentDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Aprobare document' })
  approve(@Param('id', ParseIntPipe) id: number, @Req() req: any) { return this.service.approve(id, req.user.id); }

  @Post(':id/unapprove')
  @ApiOperation({ summary: 'Dezaprobare document' })
  unapprove(@Param('id', ParseIntPipe) id: number, @Req() req: any) { return this.service.unapprove(id, req.user.id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Ștergere document (soft)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) { return this.service.softDelete(id, req.user.id); }
}
