import { Body, Controller, HttpException, HttpStatus, Post, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

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

}
