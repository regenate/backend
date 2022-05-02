import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { MenteeRoleGuard, MentorRoleGuard } from './custom-guards/roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Authorize as AuthorizeTypes } from './types';

export const Authorize = (...authTypes: AuthorizeTypes[]): any => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const guards: Map<AuthorizeTypes, Function | CanActivate> = new Map();
  const useGuards: (ClassDecorator | MethodDecorator | PropertyDecorator)[] =
    [];

  guards.set('mentor', MentorRoleGuard);
  guards.set('mentee', MenteeRoleGuard);

  authTypes.forEach((authType) => {
    useGuards.push(UseGuards(guards.get(authType)));
  });

  return applyDecorators(UseGuards(JwtAuthGuard), ...useGuards);
};
