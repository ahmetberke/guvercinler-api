import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { CycleDTO, CycleUpdateDTO } from './cycle.dto';
import { GenericFilter } from 'src/generics/filter.generic';
import { Cycle } from '@prisma/client';

@Controller('cycle')
export class CycleController {

  constructor(
    private cycleService: CycleService
  ) {}

  @Get()
  async GetAllCycles(@Query() filter : GenericFilter & Cycle) {
    return await this.cycleService.GetAll(filter)
  }

  @Get(":slug")
  async GetSingleCycle(@Param("slug") slug: string) {
    return await this.cycleService.GetBySlug(slug);
  } 

  @Post()
  async CreateCycle(@Body() cycle: CycleDTO) {
    if (await this.cycleService.GetActive())
      throw new HttpException("Şuanda zaten aktif bir dönem mevcut", HttpStatus.BAD_REQUEST)
    return await this.cycleService.Create(cycle);
  }

  @Put(":slug")
  async UpdateCycle(@Param("slug") id: string, @Body() cycle: CycleUpdateDTO) {
    return await this.cycleService.Update(id, cycle);
  }

  @Delete(":slug")
  async DeleteCycle(@Param("slug") slug : string) {
    return await this.cycleService.Delete(slug);
  }
  
  @Get(":slug/finish")
  async FinishCycle(@Param("slug") slug : string) {
    return await this.cycleService.Finish(slug);
  }

}
