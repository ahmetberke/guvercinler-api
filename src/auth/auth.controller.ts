import { Body, Controller, Get, HttpException, HttpStatus, Post, Response, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailVerificateDTO, LoginDTO, RefreshTokenDTO, RegisterDTO } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators';
import { User } from '@prisma/client';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor (
    private userService: UserService,
    private authService: AuthService
  ) {}
  
  @Post('login')
  async login(@Body() body: LoginDTO) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST); // Hatalı kullanıcı girişi
    }
    return {
      token: await this.authService.login(user),
      user
    } // Token üret
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.userService.Create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user : User) {
    return user
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDTO) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('email-verificate')
  async emailVerificate(@CurrentUser() user : User, @Body() body: EmailVerificateDTO) {
    await this.userService.EmailVerify(user.email, body.code)
    return {
      success: true
    } 
  }

}
