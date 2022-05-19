// eslint-disable-next-line no-shadow
export enum RoleEnum {
  none = 0,
  mentor = 1,
  mentee = 2,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RoleEnum {
  export const ALL_VALUES = [RoleEnum.none, RoleEnum.mentor, RoleEnum.mentee];
  export const VALID_VALUES = [RoleEnum.mentor, RoleEnum.mentee];
  export function isValid(role: RoleEnum): boolean {
    return VALID_VALUES.includes(role);
  }
}
