import { Module } from '@nestjs/common';
import { CircleService } from './services/circle.service';
import { CircleController, InviteController } from './controllers';
import { InviteService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule'u ekleyin
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'), // .env dosyasından al
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, // Süreyi al
      }),
      inject: [ConfigService], // ConfigService'i enjekte edin
    }),
    MailModule
  ],
  providers: [CircleService, InviteService],
  controllers: [CircleController, InviteController]
})
export class CircleModule {}
