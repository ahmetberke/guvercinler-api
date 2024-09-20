import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor (
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
    return this.jwtService.sign(payload);
  }

}
