import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from '../user/dto/create-user-dto';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService) { }

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
}
