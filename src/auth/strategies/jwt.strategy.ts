import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token || req?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: process.env.JWT_SCRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { userId: string; type: 'access_token' | 'refresh_token' },
  ): Promise<UserEntity> {
    const userInfo = await this.userRepository.findOneBy({
      id: payload?.userId,
    });
    if (!userInfo) throw new UnauthorizedException();
    if (payload.type == 'access_token') {
      return userInfo;
    } else if (payload.type === 'refresh_token') {
      const accessToken = this.authService.generateAccessToken(userInfo);
      req.res.cookie('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        maxAge: 3600000 * 24 * AuthService.TOKEN_EXPIRE_DAYS,
        // domain: 'rud.kids',
      });
      console.log('asdf');
      return userInfo;
    }
    throw new UnauthorizedException();
  }
}
