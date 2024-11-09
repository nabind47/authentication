import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';

import { CreateUserDto } from './dto/create-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const hashedPassword = await hash(password);

    return this.prisma.user.create({ data: { name, email, password: hashedPassword } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prisma.user.update({ where: { id: Number(id) }, data: { hashedRefreshToken: refreshToken } });
  }
}
