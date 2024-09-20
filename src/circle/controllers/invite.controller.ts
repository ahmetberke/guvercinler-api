import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthedUser, CurrentUser } from 'src/decorators';
import { InviteService } from '../services';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { InviteDTO } from '../dto';
import { CircleGuard } from 'src/guards';
import { CurrentCircleID } from 'src/decorators/current-circle.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('circles/invites')
export class InviteController {

  constructor(
    private inviteService : InviteService,
    private jwtService : JwtService
  ) {}

  @Post("/")
  @UseGuards(JwtAuthGuard)
  @UseGuards(CircleGuard)
  async invite(
    @CurrentUser() user : AuthedUser,
    @CurrentCircleID() circleId: string,
    @Body() invite : InviteDTO
  ) {
    return this.inviteService.Create(invite.email, user.id, circleId)
  }

  @Get("/accept/:token")
  async acceptInvite(@Param() params : {token: string}, @Headers("Authorization") authString : string | undefined) {
    
    const authToken = authString?.split(" ")[1] || ""
    let payload : AuthedUser | null = null
    if (authToken && authString != "") {
      payload = await this.jwtService.verify(authToken);
      
      const invite = await this.inviteService.GetByTokenAndEmail(params.token, payload.email);
      if (!invite) throw new HttpException("No valid invites found for this token", HttpStatus.BAD_REQUEST);
      if (invite.isUsed) throw new HttpException("This invitation has already been used", HttpStatus.BAD_REQUEST)

      return await this.inviteService.AcceptInvite(invite.id, invite.circleId, payload.id);  

    }  
    
    const invite = await this.inviteService.GetByToken(params.token);

    return {
      token: params.token,
      message: "Registration required",
      email: invite.email
    }

  }
  

}
