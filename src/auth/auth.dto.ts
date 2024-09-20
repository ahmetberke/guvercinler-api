import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

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