import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsCurrencyCode } from "src/decorators/currency-validator.decorator";

export class CircleDTO {
 
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsCurrencyCode()
  currency: string;

}