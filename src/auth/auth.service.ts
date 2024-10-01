import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.GetByEmail(email);
    if (user && await compare(password, user.password)) {
      const {password, ...result} = user;
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };
    const currentDate = new Date()
    currentDate.setMonth(currentDate.getMonth() + 6);
    const auth = await this.prisma.auth.create({
      data: {
        refreshToken: this.generateRefreshToken(),
        userId: user.id,
        expireTime: currentDate.getTime()
      }
    })
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: auth.refreshToken
    }
  }

  async refreshToken(refreshToken : string) {
    const auth = await this.prisma.auth.findUnique({
      where: {
        refreshToken
      },
      select: {
        expireTime: true,
        user: true,
        id: true
      }
    })
    
    if (auth.expireTime < Date.now()) {
      this.prisma.auth.delete({
        where: {
          id: auth.id
        }
      });
      throw new HttpException("unauthorized", HttpStatus.UNAUTHORIZED)
    }

    const payload = {email: auth.user.email, id: auth.user.id}
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  generateRefreshToken() {
    return randomBytes(32).toString('hex');
  }

}
