import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

import googleConfig from './config/google.config';
import jwtConfig from './config/jwt.config';
import refreshConfig from './config/refresh.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, LocalStrategy, JwtStrategy, RefreshStrategy, GoogleStrategy],
})
export class AuthModule { }
