import { Controller, Post, UseGuards, Req, Res, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Înregistrare utilizator nou' })
  async register(@Body() dto: RegisterDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Autentificare utilizator' })
  async login(@Req() req: any, @Res({ passthrough: true }) res: any) {
    return this.authService.login(req.user, res);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deconectare' })
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refresh_token ?? '';
    return this.authService.logout(req.user?.id, refreshToken, res);
  }
}
