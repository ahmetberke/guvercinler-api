import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [UserService],
})
export class UserModule {}
