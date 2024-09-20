import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exceptions.filter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    UserModule,
    ConfigModule.forRoot()
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
