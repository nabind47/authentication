import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../user/dto/create-user-dto';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService, private jwtService: JwtService) { }

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

        return { id: user.id, name: user.name };
    }

    async login(id: string, name?: string) {
        const { accessToken } = await this.generateToken(id);

        return { id, name, accessToken };
    }

    async generateToken(id: string) {
        const payload = { sub: id };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        ]);

        return { accessToken, refreshToken };
    }

    async validateJwtUser(id: string) {
        const user = await this.userService.findById(id);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        return user;
    }
}
