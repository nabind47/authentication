import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';


import { AuthService } from './auth.service';

import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

import { CreateUserDto } from '../user/dto/create-user-dto';

import { Public } from './decorators/public.decorators';
import { Roles } from './decorators/roles.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req) {
    return this.authService.login(req.user.id, req.user.name, req.user.role);
  }

  @Roles(Role.ADMIN)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() { }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const resonse = await this.authService.login(req.user.id, req.user.name, req.user.role);

    res.redirect(`http://localhost:3000/api/auth/google?accessToken=${resonse.accessToken}&refreshToken=${resonse.refreshToken}&userId=${resonse.id}&name=${resonse.name}&role=${resonse.role}`)
  }


  @Post("signout")
  signout(@Request() req) {
    return this.authService.signout(req.user.id);
  }
}
