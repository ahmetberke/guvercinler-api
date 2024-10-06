import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";

export class CycleDTO {

  @ApiProperty()
  @IsString()
  @Length(6, 64)
  name: string

  @IsObjectId()
  circleId: string

}

export class CycleUpdateDTO {
  
  @ApiProperty()
  @IsString()
  @Length(6, 64)
  name: string 

}