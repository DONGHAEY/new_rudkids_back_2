import { IsNotEmpty, IsNotIn, IsNumber, IsString, Min } from 'class-validator';

export class CreateCommunityInvitationDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  maxAcceptCnt: number;
}
