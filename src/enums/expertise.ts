// eslint-disable-next-line no-shadow
export enum ExpertiseEnum {
  none = 0,
  react = 1,
  angular = 2,
  html = 3,
  css = 4,
  javascript = 5,
  typescript = 6,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ExpertiseEnum {
  export const VALID_VALUES = [
    ExpertiseEnum.react,
    ExpertiseEnum.angular,
    ExpertiseEnum.html,
    ExpertiseEnum.css,
    ExpertiseEnum.javascript,
    ExpertiseEnum.typescript,
  ];

  export const ALL_VALUES = [ExpertiseEnum.none].concat(VALID_VALUES);

  export function isValid(expertise: ExpertiseEnum): boolean {
    return VALID_VALUES.includes(expertise);
  }
}
