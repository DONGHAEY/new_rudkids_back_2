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

  async oauthLogin(
    { email, name, mobile, birth }: OauthUserPaylod,
    res: Response,
  ) {
    //
    console.log('1');
    let user: UserEntity = await this.userRepository.findOneBy({
      privacy: { email },
    });

    console.log('2');
    if (!user) {
      console.log('3');
      user = await this.userService.loginUser({
        privacy: {
          name,
          email,
          mobile,
          birth,
        },
      });
      console.log('4');
    }
    console.log('5', user);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    console.log('6');
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

  generateAccessToken(user: UserEntity): string {
    const token = this.jwtService.sign(
      { userId: user.id, type: 'access_token' },
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
      { userId: user.id, type: 'refresh_token' },
      {
        secret: process.env.JWT_SCRET_KEY,
        algorithm: 'HS256',
        expiresIn: `${AuthService.REFRESH_TOKEN_EXPIRE_DAYS}d`,
      },
    );
    return refreshToken;
  }
}
