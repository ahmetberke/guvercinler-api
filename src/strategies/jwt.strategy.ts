import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user';

interface ReaquestWithAuthentication extends Request {
  Authentication?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: ReaquestWithAuthentication) => {
          if (request?.Authentication) {
            return request.Authentication.split(' ')[1];
          }

          return request?.headers['authorization']?.split(' ')[1];
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload : any) {
    const {iat, exp, ...user} = payload 
    return [user];
  }
}
