import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleEnum } from '@src/enums/role';
import { User } from '@src/user';

@Injectable()
export class MentorRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return user.role === RoleEnum.mentor;
  }
}

@Injectable()
export class MenteeRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return user.role === RoleEnum.mentee;
  }
}
