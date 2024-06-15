import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { OauthUserPaylod } from './payload/oauth-user.payload';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  static TOKEN_EXPIRE_DAYS = 3;
  static REFRESH_TOKEN_EXPIRE_DAYS = 60;

  async oauthLogin({ email, mobile }: OauthUserPaylod, res: Response) {
    //
    let user: UserEntity = await this.userRepository.findOneBy({
      privacy: { email },
    });

    if (!user) {
      user = await this.userService.registerUser({
        privacy: {
          email,
          mobile,
        },
      });
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    res
      .cookie('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        maxAge: 3600000 * 24 * AuthService.TOKEN_EXPIRE_DAYS,
        // domain: 'rud.kids',
      })
      .cookie('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        maxAge: 3600000 * 24 * AuthService.REFRESH_TOKEN_EXPIRE_DAYS,
        // domain: 'rud.kids',
      })
      .send();
  }

  async tossTesterLogin(res: Response) {
    console.log('-');
    const testerUser = await this.userRepository.findOneBy({
      nickname: 'tosspayments',
    });
    if (!testerUser) return;
    const accessToken = this.generateAccessToken(testerUser);
    res
      .cookie('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        maxAge: 3600000 * 24 * AuthService.TOKEN_EXPIRE_DAYS,
      })
      .send();
  }

  generateAccessToken(user: UserEntity): string {
    const token = this.jwtService.sign(
      { userId: user.id, isAdmin: user.isAdmin, type: 'access_token' },
      {
        secret: process.env.JWT_SCRET_KEY,
        algorithm: 'HS256',
        expiresIn: `${AuthService.TOKEN_EXPIRE_DAYS}d`,
      },
    );
    return token;
  }

  private generateRefreshToken(user: UserEntity): string {
    const refreshToken = this.jwtService.sign(
      { userId: user.id, isAdmin: user.isAdmin, type: 'refresh_token' },
      {
        secret: process.env.JWT_SCRET_KEY,
        algorithm: 'HS256',
        expiresIn: `${AuthService.REFRESH_TOKEN_EXPIRE_DAYS}d`,
      },
    );
    return refreshToken;
  }
}
