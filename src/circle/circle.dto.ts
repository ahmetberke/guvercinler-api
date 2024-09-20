import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CircleDTO {
 
  @IsString()
  @ApiProperty()
  name: string;

}