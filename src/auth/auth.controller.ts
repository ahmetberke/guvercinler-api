import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor (
    private userService: UserService
  ) {}
  
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return body
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.userService.Create(body);
  }

}
