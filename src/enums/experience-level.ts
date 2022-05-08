// eslint-disable-next-line no-shadow
export enum ExperienceLevelEnum {
  none = 0,
  junior = 1,
  intermediate = 2,
  senior = 3,
  master = 4,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ExperienceLevelEnum {
  export const VALID_VALUES = [
    ExperienceLevelEnum.junior,
    ExperienceLevelEnum.intermediate,
    ExperienceLevelEnum.senior,
    ExperienceLevelEnum.master,
  ];

  export const ALL_VALUES = [ExperienceLevelEnum.none].concat(VALID_VALUES);

  export function isValid(expertise: ExperienceLevelEnum): boolean {
    return VALID_VALUES.includes(expertise);
  }
}
