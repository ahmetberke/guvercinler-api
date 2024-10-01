import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDTO } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcryptjs';
import { User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ){}

  async Create(data : RegisterDTO) {
    const emailVerificationCode = this.generateVerificationCode();
    const password = await hash(data.password, 10);
    const createdUser= await this.prisma.user.create({
      data: {
        ...data,
        password: password,
        emailVerificationCode
      }
    })
    this.mailService.sendHtml(data.email, "Email Verification", `Code: ${emailVerificationCode}`)
    return createdUser
  }

  async GetByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async GetById(id : string) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async Verify(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const isMatch = await compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async EmailVerify(email: string, code: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (user.emailVerificationCode !== code) throw new HttpException("Wrong email verification code", HttpStatus.BAD_REQUEST);
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isEmailVerificated: true
      }
    });
  }

  generateVerificationCode() {
    return Math.floor(Math.random() * 100000)
  }

}
