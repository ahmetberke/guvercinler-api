import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthedUser, CurrentUser } from 'src/decorators';
import { CircleDTO } from './circle.dto';
import { CircleService } from './circle.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('circles')
export class CircleController {

  constructor(
    private circleService : CircleService
  ) {}

  @Post("/")
  @UseGuards(JwtAuthGuard)
  async createCircle(
    @CurrentUser() user : AuthedUser,
    @Body() circle : CircleDTO
  ) {
    return await this.circleService.Create(circle, user.id);
  }
  
  @Get("/")
  @UseGuards(JwtAuthGuard)
  async allCircles(
    @CurrentUser() user : AuthedUser
  ) {
    return await this.circleService.GetAllByUser(user.id)
  }

}
