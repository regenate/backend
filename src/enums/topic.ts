// eslint-disable-next-line no-shadow
export enum TopicEnum {
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
export namespace TopicEnum {
  export const VALID_VALUES = [
    TopicEnum.react,
    TopicEnum.angular,
    TopicEnum.html,
    TopicEnum.css,
    TopicEnum.javascript,
    TopicEnum.typescript,
    TopicEnum.uiUx,
  ];

  export const ALL_VALUES = [TopicEnum.none].concat(VALID_VALUES);

  export function isValid(topic: TopicEnum): boolean {
    return VALID_VALUES.includes(topic);
  }
}
