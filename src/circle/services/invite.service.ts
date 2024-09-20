import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CircleDTO } from '../dto/circle.dto';
import { Circle, Invite } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class InviteService {
  constructor(
    private prisma : PrismaService
  ){}

  async Create(email: string, userId: string, circleId: string) {

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (user) {
      const checkRelation = await this.prisma.userCircleRelation.findFirst({
        where: {
          userId: user.id,
          circleId
        }
      });
  
      if (checkRelation) throw new HttpException("The user is already in this circle", HttpStatus.BAD_REQUEST)
    }

    const token = this.generateInviteToken(32)
    return await this.prisma.invite.create({
      data: {
        email,
        createdUserId: userId,
        circleId,
        token
      }
    })
  }

  async GetByTokenAndEmail(token : string, email: string) : Promise<Invite> {
    return await this.prisma.invite.findUnique({
      where: {
        token,
        email
      }
    })
  }

  async GetByToken(token : string) : Promise<Invite> {
    return await this.prisma.invite.findUnique({
      where: {
        token
      }
    })
  }

  async AcceptInvite(id: string, circleId: string, userId: string) {
    await this.prisma.userCircleRelation.create({
      data: {
        circleId,
        userId,
        role: "USER"
      }
    })
    return await this.prisma.invite.update({
      where: {
        id
      },
      data: {
        isUsed: true,
        acceptedAt: new Date()
      }
    })
  }

  generateInviteToken(length : number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result + (Date.now().toString(16));
  }

}
