import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { OauthUserPaylod } from '../payload/oauth-user.payload';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  //
  constructor() {
    super({
      clientID: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackURL: `${process.env['FRONTEND_URL']}/login-callback/kakao`,
      //   scope: ['account_email', 'name', 'birthday'],
      scope: ['account_email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<OauthUserPaylod> {
    const { email, name } = profile._json.kakao_account;
    return {
      email,
      name,
      birth: '',
      mobile: '',
    };
  }
}
