import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';


import { AuthService } from './auth.service';

import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

import { CreateUserDto } from '../user/dto/create-user-dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const resonse = await this.authService.login(req.user.id, req.user.name);

    res.redirect(`http://localhost:3000/api/auth/google?accessToken=${resonse.accessToken}&refreshToken=${resonse.refreshToken}&userId=${resonse.id}&name=${resonse.name}`)
  }


  @UseGuards(JwtAuthGuard)
  @Post("signout")
  signout(@Request() req) {
    return this.authService.signout(req.user.id);
  }
}
