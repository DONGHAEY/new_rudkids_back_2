import { IsString, Max, Min } from 'class-validator';

export class EditNicknameDto {
  @IsString()
  //   @Max(8, {
  //     message: '최대글자 8자입니다',
  //   })
  //   @Min(2, {
  //     message: '최소글자 2글자입니다',
  //   })
  nickname: string;
}
