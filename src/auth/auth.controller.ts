import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverAuthGuard } from './guards/naver-auth.guard';
import { GetUser } from './decorators/getUser.decorator';
import { OauthUserPaylod } from './payload/oauth-user.payload';
import { Request } from 'express';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('toss_tester')
  async tossTesterLogin(@Req() req: Request) {
    return await this.authService.tossTesterLogin(req.res);
  }

  @Get('/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin(
    @GetUser() oathUserPaylod: OauthUserPaylod,
    @Req() req: Request,
  ): Promise<any> {
    await this.authService.oauthLogin(oathUserPaylod, req.res);
  }

  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(
    @GetUser() oathUserPaylod: OauthUserPaylod,
    @Req() req: Request,
  ): Promise<any> {
    await this.authService.oauthLogin(oathUserPaylod, req.res);
  }

  //유저 조회 매서드 추가
}
