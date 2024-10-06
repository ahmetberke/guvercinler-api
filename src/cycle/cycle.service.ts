import { HttpException, Injectable } from '@nestjs/common';
import { Cycle } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CycleDTO, CycleUpdateDTO } from './cycle.dto';
import { slugify } from 'src/utils/slugify';
import { CreatePrismaQuery, GenericFilter } from 'src/generics/filter.generic';

@Injectable()
export class CycleService {

  constructor(
    private prisma: PrismaService
  ) {}

  async GetAll(filter: GenericFilter & Cycle) : Promise<any> {
    const queries = CreatePrismaQuery<Cycle>(filter, ["name", "slug"]);
    const count = await this.prisma.cycle.count(queries.query.where);
    const data = await this.prisma.cycle.findMany(queries.query) 
    return {
      data,
      meta: {count, ...queries.meta}
    }
  }

  async GetBySlug(slug: string) : Promise<Cycle> {
    return await this.prisma.cycle.findUnique({
      where: {
        slug
      }
    })
  }

  async Create(cycle: CycleDTO) : Promise<Cycle> {
    return await this.prisma.cycle.create({
      data: {
        slug: `${slugify(cycle.name)}-${Date.now().toString(16)}`,
        ...cycle
      }
    })
  }

  async GetActive() {
    return await this.prisma.cycle.findFirst({
      where: {
        isActive: true
      }
    })
  }

  async Update(slug: string, cycle: CycleUpdateDTO) : Promise<Cycle> {
    return await this.prisma.cycle.update({
      where: {
        slug
      },
      data: {
        ...cycle
      }
    })
  }

  async Finish(slug: string) : Promise<Cycle> {
    return await this.prisma.cycle.update({
      where: {
        slug,
        isActive: true,
      },
      data: {
        isActive: false
      }
    })
  }

  async Delete(slug: string) {
    return await this.prisma.cycle.delete({
      where: {
        slug
      }
    })
  }

}
