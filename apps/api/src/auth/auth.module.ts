import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, LocalStrategy],
})
export class AuthModule { }
