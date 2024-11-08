import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserDto } from '../user/dto/create-user-dto';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService) { }

    async signup(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) throw new ConflictException('User already exists');

        return this.userService.create(createUserDto);
    }
}
