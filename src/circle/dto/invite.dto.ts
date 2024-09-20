import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class InviteDTO {
 
  @IsEmail()
  @ApiProperty()
  email: string;

}