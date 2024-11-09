import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

import { CreateUserDto } from '../user/dto/create-user-dto';
import refreshConfig from './config/refresh.config';

import { UserService } from '../user/user.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY)
        private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    ) { }

    async signup(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) throw new ConflictException('User already exists');

        return this.userService.create(createUserDto);
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatch = await verify(user.password, password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id, name: user.name, role: user.role };
    }

    async login(id: string, name?: string, role?: Role) {
        const { accessToken, refreshToken } = await this.generateToken(id);
        const hashedRefreshToken = await hash(refreshToken);

        await this.userService.updateRefreshToken(id, hashedRefreshToken);
        return { id, name, role, accessToken, refreshToken };
    }

    async generateToken(id: string) {
        const payload = { sub: id };

        // const [accessToken, refreshToken] = await Promise.all([
        //     this.jwtService.signAsync(payload),
        //     this.jwtService.signAsync(payload, this.config),
        // ]);
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig),
        ]);

        return { accessToken, refreshToken };
    }

    async validateJwtUser(id: string) {
        const user = await this.userService.findById(id);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async validateRefresh(id: string, refreshToken: string) {
        const user = await this.userService.findById(id);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const refreshTokenMatch = await verify(user.hashedRefreshToken, refreshToken);
        if (!refreshTokenMatch) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async refreshToken(id: string, name?: string) {
        const { accessToken, refreshToken } = await this.generateToken(id);
        const hashedRefreshToken = await hash(refreshToken);

        await this.userService.updateRefreshToken(id, hashedRefreshToken);

        return { id, name, accessToken, refreshToken };
    }
    async validateGoogleUser(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) return user;

        return this.userService.create(createUserDto);
    }

    async signout(id: string) {
        await this.userService.updateRefreshToken(id, null);
    }
}
