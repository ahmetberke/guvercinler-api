import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CircleDTO } from '../dto/circle.dto';
import { Circle } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class CircleService {
  constructor(
    private prisma : PrismaService
  ){}

  async Create(circle : CircleDTO, userId: string) : Promise<Circle> {

    const slug = `${slugify(circle.name)}-${Date.now().toString(16)}`

    const createdCircle =  await this.prisma.circle.create({
      data: {
        slug,
        ...circle
      }
    })
    await this.prisma.userCircleRelation.create({
      data: {
        circleId: createdCircle.id,
        userId: userId,
        role: "SUPER_ADMIN"
      }
    })
    return createdCircle 
  }

  async GetAllByUser(userId: string) : Promise<Array<Circle>> {
    const result = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        circles: {
          select: {
            circle: true
          }
        }
      }
    })
    return result.circles.map(circle => circle.circle)
  }

}
