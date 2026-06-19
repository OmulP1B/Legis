import { Controller, Get, Post, Delete, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('favorites')
  @ApiOperation({ summary: 'Lista documentelor favorite' })
  getFavorites(@Req() req: any) {
    return this.usersService.getFavorites(req.user.id);
  }

  @Post('favorites/:docId')
  @ApiOperation({ summary: 'Adaugă la favorite' })
  addFavorite(@Req() req: any, @Param('docId', ParseIntPipe) docId: number) {
    return this.usersService.addFavorite(req.user.id, docId);
  }

  @Delete('favorites/:docId')
  @ApiOperation({ summary: 'Elimină din favorite' })
  removeFavorite(@Req() req: any, @Param('docId', ParseIntPipe) docId: number) {
    return this.usersService.removeFavorite(req.user.id, docId);
  }
}
