import { Injectable } from '@nestjs/common';
import { RegisterDTO } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService
  ){}

  async Create(data : RegisterDTO) {
    const password = await hash(data.password, 10);
    return await this.prisma.user.create({
      data: {
        ...data,
        password: password,
      }
    })
  }

  async GetByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

}
