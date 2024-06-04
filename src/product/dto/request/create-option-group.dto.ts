import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
