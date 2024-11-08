import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';


import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

import { CreateUserDto } from '../user/dto/create-user-dto';

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
    return req.user;
  }
}
