import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export default class AdminCheckGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user as UserEntity;
    if (!user) return false;
    const checkAdmin = this.reflector.get<boolean>(
      'check_admin',
      context.getHandler(),
    );
    // console.log(user.isAdmin === true, '--');
    if (!checkAdmin) return true;
    return user.isAdmin == true;
  }
}
