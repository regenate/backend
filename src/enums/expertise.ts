// eslint-disable-next-line no-shadow
export enum ExpertiseEnum {
  none = 0,
  react = 1,
  angular = 2,
  html = 3,
  css = 4,
  javascript = 5,
  typescript = 6,
  uiUx = 7,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ExpertiseEnum {
  export const ALL_VALUES = [
    ExpertiseEnum.none,
    ExpertiseEnum.react,
    ExpertiseEnum.angular,
    ExpertiseEnum.html,
    ExpertiseEnum.css,
    ExpertiseEnum.javascript,
    ExpertiseEnum.typescript,
    ExpertiseEnum.uiUx,
  ];

  export function isValid(expertise: ExpertiseEnum): boolean {
    return ALL_VALUES.includes(expertise);
  }
}
