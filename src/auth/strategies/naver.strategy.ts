import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-naver-v2';
import { PassportStrategy } from '@nestjs/passport';
import { OauthUserPaylod } from '../payload/oauth-user.payload';
import { plainToClass } from 'class-transformer';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env['NAVER_CLIENT_ID'],
      clientSecret: process.env['NAVER_CLIENT_SECRET'],
      callbackURL: `${process.env['FRONTEND_URL']}/login-callback/naver`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<OauthUserPaylod> {
    const { email, name, birthday: birth, mobile } = profile._json.response;
    return plainToClass(OauthUserPaylod, {
      email,
      name,
      birth,
      mobile,
    });
  }
}
