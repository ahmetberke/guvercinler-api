import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, IsStrongPassword, Length, Matches } from "class-validator";

export class LoginDTO {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string
}

export class RegisterDTO {
  @IsEmail()
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  fullname: string

}

export class RefreshTokenDTO {
  @ApiProperty()
  @Length(64, 64, {
    message: 'refresh token must be exactly 64 characters long',
  })
  @Matches(/^[a-fA-F0-9]+$/, {
    message: 'refresh token only can be hex decimal',
  })
  refreshToken: string
}

export class EmailVerificateDTO {
  @ApiProperty()
  @IsNumber()
  code: number
}