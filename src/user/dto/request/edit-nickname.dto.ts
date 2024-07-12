import { IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class EditNicknameDto {
  @IsString()
  @MaxLength(8, {
    message: '최대글자 8자입니다',
  })
  @MinLength(2, {
    message: '최소글자 2글자입니다',
  })
  nickname: string;
}
